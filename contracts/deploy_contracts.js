const dcbase = require("./deploy_contracts_base.js");
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
scs_amount = dcbase.scs_amount;
scsids = dcbase.scsids;
scsmonitorids = dcbase.scsmonitorids;
getResetRNGGroupPromise = dcbase.getResetRNGGroupPromise;

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));

sendMCPromise = dcbase.sendMCPromise;
registerSCSSubChainProtocolBasePromise = dcbase.registerSCSSubChainProtocolBasePromise;

async function main() {
    // deploy two contracts: vnodeprotocolbase, subchainprotocolbase
    vnodeProtocolBase  = await deployVnodeProtocolBaseContractPromise();
    console.log('VnodeProtocolBase Contract deployed! address: ' + vnodeProtocolBase.address + " " + green_check_mark);
    subChainProtocolBase = await deploySubChainProtocolBaseContractPromise();
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

    // wait for 3 blocks for before deploy subchainbase becausue its size too large for contract creation gas cost
    _bc = await getBlockNumber();
    while(true) {
        bc = await getBlockNumber();
        //console.log("1 Current bc: ", bc, "wait until bc: ", (_bc + 3));
        sleep(1000);
        if (bc > _bc + 3) {
            break;
        }
    }

    subChainBase = await deploySubChainBaseContractPromise();
    console.log("SubChainBase Contract deployed! address: "+ subChainBase.address + " " + green_check_mark);

    subChainBase.allEvents(
        {fromBlock: 0},
        (error, event) => { console.log(event); }
    );

    addfund =  await addFundPromise(addFundAmount);
    console.log("Added fund " + addFundAmount + " mc to subchain addr: " + subChainBase.address + " "+ green_check_mark);

    registerOpenResult = await registerOpenPromise();
    console.log("SubChainBase register open, hash: " + registerOpenResult + " " + green_check_mark);

    // wait for 6 blocks for all scs to send register tx
    _bc = await getBlockNumber();
    while(true) {
        bc = await getBlockNumber();
        sleep(1000);
        //console.log("2 Current bc: ", bc, "wait until bc: ", (_bc + 3));
        if (bc > _bc + 6) {
            break;
        }
    }

    //registerClosePromise
    registerCloseResult = await registerClosePromise();
    console.log("SubChainBase register close, hash: " + registerCloseResult + " " + green_check_mark);

    //register monitor
    for (i = 0; i < scsmonitorids.length; i++) {
        scsid = scsmonitorids[i];
        result = await registerSCSSubChainBaseAsMonitorPromise(scsid);
        console.log("Registered scs " + scsid + " as monitor " + "hash: " + result + " " + green_check_mark);
    }

    // wait for 3 blocks before deploy dappbase
    _bc = await getBlockNumber();
    while(true) {
        bc = await getBlockNumber();
        sleep(1000);
        //console.log("3 Current bc: ", bc, "wait until bc: ", (_bc + 3));
        if (bc > _bc + 3) {
            break;
        }
    }

    nonce = 0;
    dappBaseContract = await deployDappBaseContractPromise(tokensupply/exchangerate, nonce);
    console.log("DappBase Contract deployed! address: "+ dappBaseContract.address + " " + green_check_mark);

    nonce += 1;
    dappContract = await deployDappContractPromise(0, nonce);
    console.log("Dapp Contract deployed! address: "+ dappContract.address + " " + green_check_mark);

    /*
    // wait for 6 blocks before query for rng node count
    _bc = await getBlockNumber();
    while(true) {
        bc = await getBlockNumber();
        sleep(1000);
        if (bc > _bc + 6) {
            break;
        }
    }*/

    /*
    result = await getRNGNodeCountPromise();
    console.log("RNG enabled with " + result + " nodes." + green_check_mark);

    // wait for 50 blocks before query for reset rng
    while(true) {
        _bc = await getBlockNumber();
        while(true) {
            bc = await getBlockNumber();
            sleep(1000);
            if (bc > _bc + 50) {
                break;
            }
        }

        result = await getResetRNGGroupPromise();
        console.log("RNG reset with " + result + " nodes." + green_check_mark);
        }*/

}

main();


// For deploy vnodeprotocolbase
function deployVnodeProtocolBaseContractPromise() {
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + vnodeProtocolBaseBin,
            gas: "10000000"
        };

        vnodeProtocolBaseContract.new(
            bmin,
            deployTransaction,
            (e, contract) => {
                if (e) {
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For deploy subchainprotocolbase
function deploySubChainProtocolBaseContractPromise(){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + subChainProtocolBaseBin,
            gas: "10000000"
        };

        subChainProtocolBaseContract.new(
            subChainProtocolBaseProtocol,
            bmin,
            subChainProtocolBaseProtocolType,
            deployTransaction,
            (e, contract) => {
                if (e) {
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For deploy dappbase
function deployDappBaseContractPromise(amount_in_mc, nonce){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            value: chain3.toSha(amount_in_mc,'mc'),
            to: subChainBase.address,
            data: '0x' + dappBaseBin,
            gas: "0",
            shardingFlag: "0x3",
            via: install_account,
            nonce: nonce
        };

        chain3.mc.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For deploy dapp
function deployDappContractPromise(amount_in_mc, nonce){
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

        chain3.mc.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For deploy subchainbase
function deploySubChainBaseContractPromise(){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + subChainBaseBin,
            gas: "10000000"
        };
        subChainBaseContract.new(
            subChainProtocolBase.address,
            vnodeProtocolBase.address,
            minMember,
            maxMember,
            thousandth,
            flushRound,
            tokensupply,
            exchangerate,
            threshold,
            deployTransaction,
            (e, contract) => {
                if (e) {
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For register scs to subchainbaseprotocol pool
function registerSCSSubChainProtocolBasePromise(scsid) {
    return new Promise((resolve, reject) => {
        registerTransaction = {
            from: install_account,
		    to: subChainProtocolBase.address,
		    gas: "10000000",
		    data: subChainProtocolBase.register.getData("0x" + scsid),
            value: chain3.toSha(bmin, 'mc')
        };
        chain3.mc.sendTransaction(registerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For register scs to subchainbase as monitor
function registerSCSSubChainBaseAsMonitorPromise(scsid) {
    return new Promise((resolve, reject) => {
        registerTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
		    data: subChainBase.registerAsMonitor.getData("0x" + scsid, "scs_monitor:8545"),
            value: chain3.toSha(1, 'mc')
        };
        chain3.mc.sendTransaction(registerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For subchainbase register open
function registerOpenPromise(scsid) {
    return new Promise((resolve, reject) => {
        registerOpenTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
		    data: subChainBase.registerOpen.getData()
        };
        chain3.mc.sendTransaction(registerOpenTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For subchainbase register close
function registerClosePromise() {
    return new Promise((resolve, reject) => {
        registerCloseTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "2000000",
		    data: subChainBase.registerClose.getData()
        };
        chain3.mc.sendTransaction(registerCloseTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For subchainbase add fund
function addFundPromise(amount_in_mc) {
    return new Promise((resolve, reject) => {
        addFundTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "2000000",
		    data: subChainBase.addFund.getData(),
            value: chain3.toSha(amount_in_mc,'mc')
        };
        chain3.mc.sendTransaction(addFundTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

// For subchainbase register close
function getBlockNumber() {
    return new Promise((resolve, reject) => {
        chain3.mc.getBlockNumber((e, blocknumber) => {
            if (!e) {
                resolve(blocknumber);
            } else {
                reject(e);
            }
        });
    });
}

// register vnode proxy
function registerAsVnodeProxy(vnode, via, link, rpclink) {
    return new Promise((resolve, reject) => {
        registerAsVnodeProxyTransaction = {
            from: install_account,
		    to: vnodeProtocolBase.address,
		    gas: "10000000",
		    data: vnodeProtocolBase.register.getData(vnode, via, link, rpclink),
            value: chain3.toSha(bmin, 'mc')
        };
        chain3.mc.sendTransaction(registerAsVnodeProxyTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
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
                reject(e);
            }
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
