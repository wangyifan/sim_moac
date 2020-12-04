require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

const dcbase = require("./deploy_contracts_base_rng.js");
install_account = dcbase.install_account;
vnodeLink = dcbase.vnodeLink;
vnodeRpc = dcbase.vnodeRpc;
version = dcbase.version;
password = dcbase.password;
bmin = dcbase.bmin;
unlock_forever = dcbase.unlock_forever;
chain3 = dcbase.chain3;
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

// for docker product deployment
//hostport = "http://"+ "127.0.0.1" + ":" + "18545";

hostport = "http://"+ "172.20.1.11" + ":" + "8545";
chain3.setProvider(new chain3.providers.HttpProvider(hostport));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));
vssBaseContract = chain3.mc.contract(JSON.parse(vssBaseAbi));

sendMCPromise = dcbase.sendMCPromise;
registerSCSSubChainProtocolBasePromise = dcbase.registerSCSSubChainProtocolBasePromise;

async function main() {

    // deploy two contracts: vnodeprotocolbase, subchainprotocolbase
    vnodeProtocolBase  = await deployVnodeProtocolBaseContractPromise(vnodeProtocolBaseContract);
    console.log('VnodeProtocolBase Contract deployed! address: ' + vnodeProtocolBase.address + " " + green_check_mark);
    subChainProtocolBase = await deploySubChainProtocolBaseContractPromise(subChainProtocolBaseContract);
    console.log("SubChainProtocolBase Contract deployed! address: "+ subChainProtocolBase.address + " " + green_check_mark);

    // send scsid some mc
    allscsids = scsids.concat(scsmonitorids);
    for (i = 0; i < allscsids.length; i++) {
        scsid = allscsids[i];
        await sendMCPromise(chain3, install_account, scsid, scs_amount);
        console.log("Sent " + scs_amount + " mc to scsid " + scsid + " " + green_check_mark);
    }

    // register vnode proxy
    vnodeProxy = await registerAsVnodeProxy(install_account, install_account, vnodeLink, vnodeRpc);
    while(true) {
        vnodeCount = parseInt(vnodeProtocolBase.vnodeList(install_account).toString());
        if (vnodeCount > 0) {
            console.log("Registered vnode proxy: " + install_account + " with vnode pool " + green_check_mark);
            break;
        }
    }

    // scs should register with subchainprotocol pool
    for (i = 0; i < scsids.length; i++) {
        scsid = scsids[i];
        await registerSCSSubChainProtocolBasePromise(chain3, subChainProtocolBase, scsid);
    }

    // wait for scs to perform
    performingSCS = [];
    while(true) {
        allPerforming = true;
        for (i = 0; i < scsids.length; i++) {
            scsid = scsids[i];
            //console.log(subChainProtocolBase.scsList("0x" + scsid));
            if (subChainProtocolBase.isPerforming("0x" + scsid)) {
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
    console.log("VssBase contract deployed! address: " + vssBase.address + " " + green_check_mark);

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

    subChainBase = await deploySubChainBaseContractPromise(vssBase.address);
    console.log("SubChainBase Contract deployed! address: "+ subChainBase.address + " " + green_check_mark);

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

    setCaller =  await setCallerPromise(vssBase, subChainBase.address);
    console.log("Set vssbase's caller to address: " + subChainBase.address + " with hash: " + setCaller + " " + green_check_mark);

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
    console.log("Added fund " + addFundAmount + " mc to subchain addr: " + subChainBase.address + " "+ green_check_mark);

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
    lastSender = vssBase.GetLastSender();
    console.log("get last sender: " + lastSender + " " + green_check_mark);
    //caller = await getCallerPromise(vssBase);
    caller = vssBase.GetCaller();
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
        tokensupply/exchangerate, nonce, subChainBase, chain3
    );
    console.log("DappBase Contract deployed!" + green_check_mark);

    nonce += 1;
    dappContract = await deployDappContractPromise(
        3, nonce, subChainBase, chain3
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
                role = await getSCSRolePromise("0x" + scsid, chain3);
                console.log("\tnode performance [" + scsid +"] => " + performance + " role => " + role);
            }

            for (i = 0; i < extra_scsids.length; i++) {
                scsid = extra_scsids[i];
                performance = await subChainBase.nodePerformance.call("0x"+scsid);
                role = await getSCSRolePromise("0x" + scsid, chain3);
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


// For deploy vnodeprotocolbase
function deployVnodeProtocolBaseContractPromise() {
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + vnodeProtocolBaseBin,
            gas: "9000000"
        };

        vnodeProtocolBaseContract.new(
            bmin,
            deployTransaction,
            (e, contract) => {
                if (e) {
                    console.log("deployVnodeProtocolBaseContractPromise reject: " + e);
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For deploy dapp
function deployDappContractPromise(amount_in_mc, nonce, subChainBase, chain3_){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            value: chain3.toSha(amount_in_mc,'mc'),
            to: subChainBase.address,
            data: '0x' + dappBin,
            gas: "0",
            shardingFlag: "0x3",
            via: install_account,
            nonce: nonce
        };

        chain3_.mc.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("deployDappContractPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For deploy subchainbase
function deploySubChainBaseContractPromise(vssbaseaddr){
    return new Promise((resolve, reject) => {
        console.log("deploySubChainBaseContractPromise #"+ subChainBaseBin + "#");
        deployTransaction = {
            from: install_account,
            data: '0x' + subChainBaseBin,
            gas: "9000000"
        };

        // randdrop
        subChainBaseContract.new(
            subChainProtocolBase.address,
            vnodeProtocolBase.address,
            //vnodeProtocolBase.address, // ercaddr
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
}

// For register scs to subchainbaseprotocol pool
function registerSCSSubChainProtocolBasePromise(scsid) {
    return new Promise((resolve, reject) => {
        data_ = subChainProtocolBase.register.getData("0x" + scsid);
        console.log("subchain protocol base register [data]: " + data_);
        registerTransaction = {
            from: install_account,
		    to: subChainProtocolBase.address,
		    gas: "1000000",
		    data: subChainProtocolBase.register.getData("0x" + scsid),
            value: chain3.toSha(bmin, 'mc')
        };
        chain3.mc.sendTransaction(registerTransaction, (e, transactionHash) => {
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
        data_ = subChainBase.registerAsMonitor.getData("0x" + scsid, "scs_monitor:8545");
        console.log("subchainbase register as monitor [data]: " + data_);
        registerTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.registerAsMonitor.getData("0x" + scsid, "scs_monitor:8545"),
            value: chain3.toSha(1, 'mc')
        };
        chain3.mc.sendTransaction(registerTransaction, (e, transactionHash) => {
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
        data_ = vssBase.GetLastSender.getData();
        console.log("vssBase getLastSender [data]: " + data_);
        getLastSenderTransaction = {
            from: install_account,
		    to: vssBase.address,
		    gas: "1000000",
		    data: vssBase.GetLastSender.getData()
        };
        chain3.mc.sendTransaction(getLastSenderTransaction, (e, transactionHash) => {
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
        data_ = vssBase.GetCaller.getData();
        console.log("vssBase getCaller [data]: " + data_);
        getCallerTransaction = {
            from: install_account,
		    to: vssBase.address,
		    gas: "1000000",
		    data: vssBase.GetCaller.getData()
        };
        chain3.mc.sendTransaction(getCallerTransaction, (e, transactionHash) => {
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
        data_ = subChainBase.registerOpen.getData();
        console.log("subchainbase register open [data]: " + data_);
        registerOpenTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.registerOpen.getData()
        };
        chain3.mc.sendTransaction(registerOpenTransaction, (e, transactionHash) => {
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
        data_ = subChainBase.registerClose.getData();
        console.log("subchainbase register close [data]: " + data_);
        registerCloseTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.registerClose.getData()
        };
        chain3.mc.sendTransaction(registerCloseTransaction, (e, transactionHash) => {
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
        data_ = vssbase.setCaller.getData(subchainbaseaddr);
        console.log("vssbase setcaller [data]: " + data_);
        setCallerTransaction = {
            from: install_account,
		    to: vssbase.address,
		    gas: "1000000",
		    data: vssbase.setCaller.getData(subchainbaseaddr)
        };
        chain3.mc.sendTransaction(setCallerTransaction, (e, transactionHash) => {
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
function addFundPromise(amount_in_mc) {
    return new Promise((resolve, reject) => {
        data_ = subChainBase.addFund.getData();
        console.log("subchainbase addfund [data]: " + data_);
        addFundTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.addFund.getData(),
            value: chain3.toSha(amount_in_mc,'mc')
        };
        chain3.mc.sendTransaction(addFundTransaction, (e, transactionHash) => {
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
        chain3.mc.getBlockNumber((e, blocknumber) => {
            if (!e) {
                resolve(blocknumber);
            } else {
                //console.log("getBlockNumber reject: " + e);
                reject(e);
            }
        });
    }).catch("getblocknumber error");
}

// register vnode proxy
function registerAsVnodeProxy(vnode, via, link, rpclink) {
    return new Promise((resolve, reject) => {
        data_ = vnodeProtocolBase.register.getData(vnode, via, link, rpclink);
        console.log("register as vnode proxy [data]: " + data_);
        registerAsVnodeProxyTransaction = {
            from: install_account,
		    to: vnodeProtocolBase.address,
		    gas: "9000000",
		    data: vnodeProtocolBase.register.getData(vnode, via, link, rpclink),
            value: chain3.toSha(bmin, 'mc')
        };
        chain3.mc.sendTransaction(registerAsVnodeProxyTransaction, (e, transactionHash) => {
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
        transaction = {
		    to: subChainBase.address,
		    data: subChainBase.rngNodeCount.getData()
        };
        chain3.mc.call(transaction, (e, result) => {
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
function getSCSRolePromise(scsid, chain3) {
    return new Promise((resolve, reject) => {
        getscsroleTransaction = {
		    to: subChainBase.address,
		    data: subChainBase.getSCSRole.getData(scsid)
        };
        chain3.mc.call(getscsroleTransaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
                reject(e);
            }
        });
    });
}
