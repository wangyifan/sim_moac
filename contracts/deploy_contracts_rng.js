require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
var Tx = require('ethereumjs-tx').Transaction;

const dcbase = require("./deploy_contracts_base_rng.js");
install_account = dcbase.install_account;
vnodeLink = dcbase.vnodeLink;
vnodeRpc = dcbase.vnodeRpc;
version = dcbase.version;
password = dcbase.password;
bmin = dcbase.bmin;
unlock_forever = dcbase.unlock_forever;
convertUnit = dcbase.convertUnit;
check_mark = dcbase.check_mark;
RED = dcbase.RED;
GREEN = dcbase.GREEN;
NC = dcbase.NC;
green_check_mark = dcbase.green_check_mark;
subChainProtocolBase = dcbase.subChainProtocolBase;
vnodeProtocolBase = dcbase.vnodeProtocolBase;
subChainBase = dcbase.subChainBase;
minMember = dcbase.minMember;
maxMember = dcbase.maxMember;
thousandth = dcbase.thousandth;
threshold = dcbase.threshold;
flushRound = dcbase.flushRound;
tokensupply = dcbase.tokensupply;
exchangerate = dcbase.exchangerate;
addFundAmount = dcbase.addFundAmount;
vssBaseAbi = dcbase.vssBaseAbi;
scs_amount = dcbase.scs_amount;
scsids = dcbase.scsids;
scsmonitorids = dcbase.scsmonitorids;
getResetRNGGroupPromise = dcbase.getResetRNGGroupPromise;
deploySubChainProtocolBaseContractPromise = dcbase.deploySubChainProtocolBaseContractPromise;
deployVnodeProtocolBaseContractPromise = dcbase.deployVnodeProtocolBaseContractPromise;
deployDappBaseContractPromise = dcbase.deployDappBaseContractPromise;
deployVssBaseContractPromise = dcbase.deployVssBaseContractPromise;

if (dcbase.useChain3) {
    sdk3 = dcbase.chain3;
    sdk3Chain = sdk3.mc;
    sdk3Personal = sdk3.personal;
    sdk3Contract = sdk3Chain.contract;
    console.log("using chain3 " + green_check_mark);
} else {
    sdk3 = dcbase.web3;
    sdk3Chain = sdk3.eth;
    sdk3Personal = sdk3.eth.personal;
    sdk3Contract = sdk3Chain.Contract;
    console.log("using web3 " + green_check_mark);
}

hostport = "http://"+ "172.20.0.11" + ":" + "8545";
sdk3.setProvider(new sdk3.providers.HttpProvider(hostport));

if (dcbase.useChain3) {
    vnodeProtocolBaseContract = sdk3Contract(JSON.parse(vnodeProtocolBaseAbi));
    subChainProtocolBaseContract = sdk3Contract(JSON.parse(subChainProtocolBaseAbi));
    subChainBaseContract = sdk3Contract(JSON.parse(subChainBaseAbi));
    dappBaseContract = sdk3Contract(JSON.parse(dappBaseAbi));
    vssBaseContract = sdk3Contract(JSON.parse(vssBaseAbi));
} else {
    vnodeProtocolBaseContract = new sdk3Contract(JSON.parse(vnodeProtocolBaseAbi));
    subChainProtocolBaseContract = new sdk3Contract(JSON.parse(subChainProtocolBaseAbi));
    subChainBaseContract = new sdk3Contract(JSON.parse(subChainBaseAbi));
    dappBaseContract = new sdk3Contract(JSON.parse(dappBaseAbi));
    vssBaseContract = new sdk3Contract(JSON.parse(vssBaseAbi));
}

sendPromise = dcbase.sendPromise;
registerSCSSubChainProtocolBasePromise = dcbase.registerSCSSubChainProtocolBasePromise;

/*
var privateKey = new Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex');
var rawTx = {
  nonce: '0x11',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000033',
  value: '0x22',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
};
var tx = new Tx(rawTx);
tx.sign(privateKey);
console.log(JSON.stringify(tx));
var serializedTx = tx.serialize();
console.log(serializedTx.toString());
*/

async function main() {
    // unlock first
    await sdk3Personal.unlockAccount(install_account, password, unlock_forever);

    // deploy two contracts: vnodeprotocolbase, subchainprotocolbase
    gas = await sdk3Chain.estimateGas({
        from: install_account,
        data: '0x' + dcbase.vnodeProtocolBaseBin
    });
    vnodeProtocolBase = await deployVnodeProtocolBaseContractPromise(vnodeProtocolBaseContract, doGas(parseInt(gas)));
    if (dcbase.useChain3) {
        vnodeProtocolBaseAddress = vnodeProtocolBase.address;
    } else {
        vnodeProtocolBaseAddress = vnodeProtocolBase.options.address;
    }
    console.log('VnodeProtocolBase Contract deployed(estimate: ' + doGas(parseInt(gas))
                + ')! address: ' + vnodeProtocolBaseAddress + " " + green_check_mark);

    subChainProtocolBase = await deploySubChainProtocolBaseContractPromise(subChainProtocolBaseContract);
    if (dcbase.useChain3) {
        subChainProtocolBaseAddress = subChainProtocolBase.address;
    } else {
        subChainProtocolBaseAddress = subChainProtocolBase.options.address;
    }
    console.log("SubChainProtocolBase Contract deployed! address: "+ subChainProtocolBaseAddress + " " + green_check_mark);

    // send scsid some mc
    allscsids = scsids.concat(scsmonitorids);
    for (i = 0; i < allscsids.length; i++) {
        scsid = allscsids[i];
        await sendPromise(sdk3, sdk3Chain, install_account, scsid, scs_amount);
        console.log("Sent " + scs_amount + " mc to scsid " + scsid + " " + green_check_mark);
    }

    // register vnode proxy
    vnodeProxy = await registerAsVnodeProxy(install_account, install_account, vnodeLink, vnodeRpc);
    while(true) {
        if (dcbase.useChain3) {
            vnodeCount = parseInt(vnodeProtocolBase.vnodeList(install_account).toString());
        } else {
            vnodeCount = await vnodeProtocolBase.methods.vnodeList(install_account).call();
            vnodeCount = parseInt(vnodeCount);
        }
        if (vnodeCount > 0) {
            console.log("Registered vnode proxy: " + install_account + " with vnode pool " + green_check_mark);
            break;
        }
    }

    // scs should register with subchainprotocol pool
    for (i = 0; i < scsids.length; i++) {
        scsid = scsids[i];
        await registerSCSSubChainProtocolBasePromise(sdk3, sdk3Chain, subChainProtocolBase, scsid);
    }

    // wait for scs to perform
    performingSCS = [];
    while(true) {
        allPerforming = true;
        for (i = 0; i < scsids.length; i++) {
            scsid = scsids[i];
            //console.log(subChainProtocolBase.scsList("0x" + scsid));
            isPerforming = await subChainProtocolBase.methods.isPerforming("0x" + scsid);
            if (isPerforming) {
                if (performingSCS.indexOf(scsid) == -1) {
                    console.log("Registered scs: " + scsid + " with pool " + green_check_mark);
                    performingSCS.push(scsid);
                }
            } else {
                allPerforming = false;
            }
        }

        if (allPerforming) {
            break;
        }
    }

    // wait for 3 blocks
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 3) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    vssBase = await deployVssBaseContractPromise(vssBaseContract, threshold);
    if (dcbase.useChain3) {
        vssBaseAddress = vssBase.address;
    } else {
        vssBaseAddress = vssBase.options.address;
    }
    console.log("VssBase contract deployed! address: " + vssBaseAddress + " " + green_check_mark);

    // wait for 3 blocks
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 3) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    subChainBase = await deploySubChainBaseContractPromise(vssBaseAddress);
    if (dcbase.useChain3) {
        subChainBaseAddress = subChainBase.address;
    } else {
        subChainBaseAddress = subChainBase.options.address;
    }
    console.log("SubChainBase Contract deployed! address: "+ subChainBaseAddress + " " + green_check_mark);

    // wait for 3 blocks
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 3) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    setCaller =  await setCallerPromise(vssBase, subChainBaseAddress);
    console.log("Set vssbase's caller to address: " + subChainBaseAddress + " with hash: " + setCaller + " " + green_check_mark);

    // wait for 3 blocks for set caller to finish
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 3) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    addfund =  await addFundPromise(addFundAmount);
    console.log("Added fund " + addFundAmount + " mc to subchain addr: " + subChainBaseAddress + " "+ green_check_mark);

    registerOpenResult = await registerOpenPromise();
    console.log("SubChainBase register open, hash: " + registerOpenResult + " " + green_check_mark);

    // wait for 6 blocks for all scs to send register tx
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 6) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    //registerClosePromise
    registerCloseResult = await registerClosePromise();
    console.log("SubChainBase register close, hash: " + registerCloseResult + " " + green_check_mark);

    // wait for 6 blocks after register close
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 6) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    //lastSender = await getLastSenderPromise(vssBase);
    if (dcbase.useChain3) {
        lastSender = vssBase.GetLastSender();
    } else {
        lastSender = await vssBase.methods.GetLastSender().call();
    }
    console.log("get last sender: " + lastSender + " " + green_check_mark);
    //caller = await getCallerPromise(vssBase);
    if (dcbase.useChain3) {
        caller = vssBase.GetCaller();
    } else {
        caller = await vssBase.methods.GetCaller().call();
    }
    console.log("caller: " + caller + " " + green_check_mark);

    //register monitor
    for (i = 0; i < scsmonitorids.length; i++) {
        scsid = scsmonitorids[i];
        result = await registerSCSSubChainBaseAsMonitorPromise(scsid);
        console.log("Registered scs " + scsid + " as monitor " + "hash: " + result + " " + green_check_mark);
    }

    /*
    // wait for 12 blocks before deploy dappbase
    try {
        _bc = await getBlockNumber();
    } catch (e) {
        //console.error(e);
    }
    console.log("Wait block: " + _bc);
    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
            console.log("Wait block: " + bc);
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + 12) {
            console.log("Wait block: " + bc);
            break;
        }
    }

    nonce = 0;
    dappBaseContract = await deployDappBaseContractPromise(
        tokensupply/exchangerate, nonce, subChainBase, sdk3, sdk3Chain,
    );
    console.log("DappBase Contract deployed!" + green_check_mark);

    nonce += 1;
    dappContract = await deployDappContractPromise(
        3, nonce, subChainBase, sdk3
    );
    console.log("Dapp Contract deployed!" + green_check_mark);

    // wait for 3000 ms
    waitLength = 3000;
    try {
        _bc = await getBlockNumber();
    } catch (e) {
    }
    console.log("Wait block: " + _bc);
    */

    runStatus = false;
    while(runStatus) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + waitLength) {
            console.log("Wait block: " + bc);
            break;
        }
        try {
            const maxIndex = await vssBase.revealIndex();
            console.log("vssBase.revealIndex: " + maxIndex);
            console.log("Wait block: " + bc);
            console.log("current status:");
            const curFlushIndex = await subChainBase.curFlushIndex();
            const pendingFlushIndex = await subChainBase.pendingFlushIndex();
            const lastFlushBlk = await subChainBase.lastFlushBlk();
            const nodeToReleaseCount = await subChainBase.nodeToReleaseCount();
            const nodeCount = await subChainBase.nodeCount();
            const lastNodeChangeConfigVersion = await vssBase.lastNodeChangeConfigVersion();

            for (i = Math.max(maxIndex - 7, 0); i < maxIndex; i++) {
                const sv = await vssBase.slashingVotes.call(i);
                const rv = await vssBase.slashingRejects.call(i);
                console.log("\tvssBase.slashingVotes: " + i + " => " + sv
                            + " vssBase.slashingRejects: " + i + " => " + rv
                           );
            }

            console.log("");
            console.log("\tsubchainBase.curFlushIndex: " + curFlushIndex);
            console.log("\tsubchainBase.pendingFlushIndex: " + pendingFlushIndex);
            console.log("\tsubchainBase.lastFlushBlk: " + lastFlushBlk);
            console.log("\tsubchainBase.nodeToReleaseCount: " + nodeToReleaseCount);
            console.log("\tsubchainBase.nodeCount: " + nodeCount);
            console.log("");
            console.log("\tvssBase.lastNodeChangeConfigVersion: " + lastNodeChangeConfigVersion);
            console.log("");

            extra_scsids = ["30601cba96b98f22d5c46bb8a8b0b298b8017ef2"];
            //extra_scsids = [];

            for (i = 0; i < scsids.length; i++) {
                scsid = scsids[i];
                performance = await subChainBase.nodePerformance.call("0x"+scsid);
                role = await getSCSRolePromise("0x" + scsid, sdk3);
                console.log("\tnode performance [" + scsid +"] => " + performance + " role => " + role);
            }

            for (i = 0; i < extra_scsids.length; i++) {
                scsid = extra_scsids[i];
                performance = await subChainBase.nodePerformance.call("0x"+scsid);
                role = await getSCSRolePromise("0x" + scsid, sdk3);
                console.log("\tnode performance [" + scsid +"] => " + performance + " role => " + role);
            }

            console.log("");
            for (i = 0; i < scsids.length; i++) {
                scsid = scsids[i];
                upload = await vssBase.lastConfigUpload.call("0x"+scsid);
                console.log("\tlast config uploaded[" + scsid +"] => " + upload);
            }


            for (i = 0; i < extra_scsids.length; i++) {
                scsid = extra_scsids[i];
                upload = await vssBase.lastConfigUpload.call("0x"+scsid);
                console.log("\tlast config uploaded[" + scsid +"] => " + upload);
            }

            console.log("");
            for (i = 0; i < scsids.length; i++) {
                scsid = scsids[i];
                membership = await vssBase.vssNodeMemberships.call("0x"+scsid);
                console.log("\tvss node memberships[" + scsid +"] => " + membership);
            }


            for (i = 0; i < extra_scsids.length; i++) {
                scsid = extra_scsids[i];
                membership = await vssBase.vssNodeMemberships.call("0x"+scsid);
                console.log("\tvss node memberships[" + scsid +"] => " + membership);
            }

            console.log("---------------------------------------------");
        } catch (e) {
            console.log(e);
        }
    }
}

main();

// For deploy dapp
/*
function deployDappContractPromise(amount_in_chain, nonce, subChainBase, sdk3Chain){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            value: convertUnit(amount_in_chain),
            to: subChainBase.address,
            data: '0x' + dappBin,
            gas: "0",
            shardingFlag: "0x3",
            via: install_account,
            nonce: nonce
        };

        sdk3Chain.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("deployDappContractPromise reject: " + e);
                reject(e);
            }
        });
    });
}
*/

function doGas(estimatedGas) {
    maxGas = 8995000;
    gas = parseInt(estimatedGas * 110 / 100);
    return Math.min(maxGas, gas);
}

// For deploy subchainbase
function deploySubChainBaseContractPromise(vssbaseaddr){
    if (dcbase.useChain3) {
        return new Promise((resolve, reject) => {
            //console.log("deploySubChainBaseContractPromise #"+ subChainBaseBin + "#");
            deployTransaction = {
                from: install_account,
                data: '0x' + subChainBaseBin,
                gas: "9000000"
            };
            // randdrop
            subChainBaseContract.new(
                subChainProtocolBaseAddress,
                vnodeProtocolBaseAddress,
                //vnodeProtocolBase.options.address, // ercaddr
                //1, // ercrate
                minMember,
                maxMember,
                thousandth,
                flushRound,
                tokensupply,
                exchangerate,
                vssbaseaddr,
                deployTransaction,
                (e, contract) => {
                    if (e) {
                        console.log("deploySubChainBaseContractPromise reject: " + e);
                        reject(e);
                    }
                    if (contract && typeof contract.address !== 'undefined') {
                        resolve(contract);
                    }
                }
            );
        });
    } else {
        return subChainBaseContract.deploy({
            data: '0x' + subChainBaseBin,
            arguments: [
                subChainProtocolBase.options.address,
                vnodeProtocolBase.options.address,
                minMember,
                maxMember,
                thousandth,
                flushRound,
                tokensupply,
                exchangerate,
                vssbaseaddr
            ]
        }).send({
            from: install_account,
            gas: "9000000"
        });
    }
}

// For register scs to subchainbaseprotocol pool
function registerSCSSubChainProtocolBasePromise(scsid) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainProtocolBase.register.getData("0x" + scsid);
            to = subChainProtocolBase.address;
        } else {
            data_ = subChainProtocolBase.methods.register("0x" + scsid).encodeABI();
            to = subChainProtocolBase.options.address;
        }
        console.log("subchain protocol base register [data]: " + data_);
        registerTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_,
            value: convertUnit(bmin)
        };
        sdk3Chain.sendTransaction(registerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerSCSSubChainProtocolBasePromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For register scs to subchainbase as monitor
function registerSCSSubChainBaseAsMonitorPromise(scsid) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.registerAsMonitor.getData("0x" + scsid, "scs_monitor:8545");
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.registerAsMonitor("0x" + scsid, "scs_monitor:8545").encodeABI();
            to = subChainBase.options.address;
        }
        console.log("subchainbase register as monitor [data]: " + data_);
        registerTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_,
            value: convertUnit(1)
        };
        sdk3Chain.sendTransaction(registerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerSCSSubChainBaseAsMonitorPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For vssbase getlastsender()
function getLastSenderPromise(vssBase) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = vssBase.GetLastSender.getData();
            to = vssBase.address;
        } else {
            data_ = vssBase.methods.GetLastSender().encodeABI();
            to = vssBase.options.address;
        }
        console.log("vssBase getLastSender [data]: " + data_);
        getLastSenderTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(getLastSenderTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("getLastSenderPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For vssbase getcaller()
function getCallerPromise(vssBase) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = vssBase.GetCaller.getData();
            to = vssBase.address;
        } else {
            data_ = vssBase.methods.GetCaller().encodeABI();
            to = vssBase.options.address;
        }
        console.log("vssBase getCaller [data]: " + data_);
        getCallerTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(getCallerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("getCallerPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For subchainbase register open
function registerOpenPromise(scsid) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.registerOpen.getData();
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.registerOpen().encodeABI();
            to = subChainBase.options.address;
        }
        console.log("subchainbase register open [data]: " + data_);
        registerOpenTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(registerOpenTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerOpenPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For subchainbase register close
function registerClosePromise() {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.registerClose.getData();
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.registerClose().encodeABI();
            to = subChainBase.options.address;
        }
        console.log("subchainbase register close [data]: " + data_);
        registerCloseTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(registerCloseTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerClosePromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For vssbase contract setCaller()
function setCallerPromise(vssbase, subchainbaseaddr) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = vssbase.setCaller.getData(subchainbaseaddr);
            to = vssbase.address;
        } else {
            data_ = vssbase.methods.setCaller(subchainbaseaddr).encodeABI();
            to = vssbase.options.address;
        }
        console.log("vssbase setcaller [data]: " + data_);
        setCallerTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(setCallerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("setCallerPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For subchainbase add fund
function addFundPromise(amount_in_chain) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.addFund.getData();
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.addFund().encodeABI();
            to = subChainBase.options.address;
        }
        console.log("subchainbase addfund [data]: " + data_);
        addFundTransaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_,
            value: convertUnit(amount_in_chain)
        };
        sdk3Chain.sendTransaction(addFundTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("addFundPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// get blocknumber
function getBlockNumber() {
    return new Promise((resolve, reject) => {
        sdk3Chain.getBlockNumber((e, blocknumber) => {
            if (!e) {
                resolve(blocknumber);
            } else {
                reject(e);
            }
        });
    }).catch("getblocknumber error");
}

// register vnode proxy
function registerAsVnodeProxy(vnode, via, link, rpclink) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = vnodeProtocolBase.register.getData(vnode, via, link, rpclink);
            to = vnodeProtocolBase.address;
        } else {
            data_ = vnodeProtocolBase.methods.register(vnode, via, link, rpclink).encodeABI();
            to = vnodeProtocolBase.options.address;
        }
        console.log("register as vnode proxy [data]: " + data_);
        registerAsVnodeProxyTransaction = {
            from: install_account,
		    to: to,
		    gas: "900000",
		    data: data_,
            value: convertUnit(bmin)
        };
        sdk3Chain.sendTransaction(registerAsVnodeProxyTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerAsVnodeProxy reject: " + e);
                reject(e);
            }
        });
    });
}

function getRNGNodeCountPromise() {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.rngNodeCount.getData();
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.rngNodeCount().encodeABI();
            to = subChainBase.options.address;
        }
        transaction = {
		    to: to,
		    data: data_
        };
        sdk3Chain.call(transaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
                console.log("getRNGNodeCountPromise reject: " + e);
                reject(e);
            }
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// call getSCSRole
function getSCSRolePromise(scsid, sdk3) {
    return new Promise((resolve, reject) => {
        if (dcbase.useChain3) {
            data_ = subChainBase.getSCSRole.getData(scsid);
            to = subChainBase.address;
        } else {
            data_ = subChainBase.methods.getSCSRole(scsid).encodeABI();;
            to = subChainBase.options.address;
        }
        getscsroleTransaction = {
		    to: to,
		    data: data_
        };
        sdk3Chain.call(getscsroleTransaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
                reject(e);
            }
        });
    });
}
