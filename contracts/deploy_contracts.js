const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setting
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let vnodeLink = "vnode:50062";
let vnodeRpc = "vnode:8545";
//let version = "1.0.6";
let version = "dev";
let password = "123456";
let bmin = 2;
let unlock_forever = 0;
let chain3 = new Chain3();
let check_mark = "✓";
let RED = "\033[0;31m";
let GREEN = "\033[0;32m";
let NC = "\033[0m";
let green_check_mark = GREEN + check_mark + NC;
let subChainProtocolBase = null;
let vnodeProtocolBase = null;
let subChainBase = null;
let minMember = 1;
let maxMember = 31;
let thousandth = 1000;
let threshold = 3;
let flushRound = 50;
let tokensupply = 3;
let exchangerate = 1;
let addFundAmount = 50;

scs_amount = 1000;
scsids = [
    "a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    "43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    "8d26cd8257288a9f3fcb3c7a4b15ade3cf932925", // scs 3
    "632774bf61ffc8873e43f3ce68cf3f169300efa3", // scs 4
    "d7e1cf982f75563f166726a5814c7fa3c1948068", // scs 5
    //"30601cba96b98f22d5c46bb8a8b0b298b8017ef2", // scs 6
    //"c24c73cfb25e444fb20c3405a8327808303f4040", // scs 7
];

scsmonitorids = [
    "0b52dde836cb80a5d13c68784c338f42e1860922"  // monitor
];

// compile vnodeprotocolbase
vnodeProtocolBaseSolfile = version + "/" + "VnodeProtocolBase.sol";
vnodeProtocolBaseContract = fs.readFileSync(vnodeProtocolBaseSolfile, 'utf8');
vnodeProtocolBaseOutput = solc.compile(vnodeProtocolBaseContract, 1);
vnodeProtocolBaseAbi = vnodeProtocolBaseOutput.contracts[':VnodeProtocolBase'].interface;
vnodeProtocolBaseBin = vnodeProtocolBaseOutput.contracts[':VnodeProtocolBase'].bytecode;
console.log("VnodeProtocolBase Contract compiled, size = " + vnodeProtocolBaseBin.length + " " + green_check_mark);

// compile dappbase
dappBaseFile = version + "/" + "dappbase.sol";
dappBaseContract = fs.readFileSync(dappBaseFile, 'utf8');
dappBaseOutput = solc.compile(dappBaseContract, 1);
dappBaseAbi = dappBaseOutput.contracts[':DappBase'].interface;
dappBaseBin = dappBaseOutput.contracts[':DappBase'].bytecode;
console.log("dappBase Contract compiled, size = " + dappBaseBin.length + " " + green_check_mark);

// compile subchainprotocolbase
subChainProtocolBaseProtocol = "pos";
subChainProtocolBaseProtocolType = 0;
subChainProtocolBaseSolfile = version + "/" + "SubChainProtocolBase.sol";
subChainProtocolBaseContract = fs.readFileSync(subChainProtocolBaseSolfile, 'utf8');
subChainProtocolBaseOutput = solc.compile(subChainProtocolBaseContract, 1);
subChainProtocolBaseAbi = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].interface;
subChainProtocolBaseBin = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].bytecode;
console.log("SubChainProtocolBase Contract compiled, size = " + subChainProtocolBaseBin.length + " " + green_check_mark);

subChainBaseFileName = "SubChainBaseRNG.sol";
subChainBaseSolfiles = [subChainBaseFileName, "SubChainProtocolBase.sol"];
//subChainBaseSolfiles = ["SubChainBase.sol", "SubChainProtocolBase.sol"];
subChainBaseInput = {};
subChainBaseSolfiles.forEach(fileName => {
    file = fs.readFileSync(version + "/" + fileName, 'utf8');
    subChainBaseInput[fileName] = file;
});
subChainBaseOutput = solc.compile(
    {
        sources: subChainBaseInput,
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    1
);

if (subChainBaseOutput.errors.length > 0) {
    console.log(subChainBaseOutput.errors);
}
subChainBaseAbi = subChainBaseOutput.contracts[subChainBaseFileName + ':SubChainBase'].interface;
console.log(subChainBaseAbi);
subChainBaseBin = subChainBaseOutput.contracts[subChainBaseFileName + ':SubChainBase'].bytecode;
console.log("SubChainBase Contract compiled, size = " + subChainBaseBin.length + " " + green_check_mark);

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));

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
        await sendMCPromise(install_account, scsid, scs_amount);
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
        await registerSCSSubChainProtocolBasePromise(scsid);
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

    dappBaseContract = await deployDappBaseContractPromise(tokensupply/exchangerate);
    console.log("DappBase Contract deployed! address: "+ dappBaseContract.address + " " + green_check_mark);

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


    /*
    scsNodeIndex = 2;
    result = await requestReleaseSCSPromise(scsNodeIndex);
    console.log("Request release scs ", scsNodeIndex, " ", green_check_mark, " tx = ", result);
    */
}

main();

// For add fund to scsids
function sendMCPromise(src, dest, amount_in_mc) {
    return new Promise((resolve, reject) => {
        transaction = {
            from: src,
		    value: chain3.toSha(amount_in_mc,'mc'),
		    to: dest,
		    gas: "10000000",
		    data: ""
        };
        chain3.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

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
function deployDappBaseContractPromise(amount_in_mc){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            value: chain3.toSha(amount_in_mc,'mc'),
            to: subChainBase.address,
            data: '0x' + dappBaseBin,
            gas: "0",
            shardingFlag: "0x3",
            via: install_account,
            nonce: 0
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
function requestReleaseSCSPromise(scsNodeIndex) {
    return new Promise((resolve, reject) => {
        requestReleaseTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
		    data: subChainBase.requestRelease.getData(1, scsNodeIndex)
        };
        chain3.mc.sendTransaction(requestReleaseTransaction, (e, transactionHash) => {
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
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
		    data: subChainBase.rngNodeCount.getData()
        };
        chain3.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getResetRNGGroupPromise() {
    return new Promise((resolve, reject) => {
        transaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
		    data: subChainBase.resetRNGGroup.getData()
        };
        chain3.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}
