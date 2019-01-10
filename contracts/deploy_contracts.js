const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setting
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let vnodeLink = "vnode:50062";
let vnodeRpc = "vnode:8545";
let version = "1.0.6";
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
let maxMember = 30;
let thousandth = 1000;
let flushRound = 10;

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);

scs_amount = 1000;
scsids = [
    "a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    "43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    "8d26cd8257288a9f3fcb3c7a4b15ade3cf932925"  // scs 3
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
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
console.log("VnodeProtocolBase Contract compiled, size = " + vnodeProtocolBaseBin.length + " " + green_check_mark);

// compile subchainprotocolbase
subChainProtocolBaseProtocol = "pos";
subChainProtocolBaseProtocolType = 0;
subChainProtocolBaseSolfile = version + "/" + "SubChainProtocolBase.sol";
subChainProtocolBaseContract = fs.readFileSync(subChainProtocolBaseSolfile, 'utf8');
subChainProtocolBaseOutput = solc.compile(subChainProtocolBaseContract, 1);
subChainProtocolBaseAbi = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].interface;
subChainProtocolBaseBin = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].bytecode;
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
console.log("SubChainProtocolBase Contract compiled, size = " + subChainProtocolBaseBin.length + " " + green_check_mark);

subChainBaseSolfiles = ["SubChainBase.sol", "SubChainProtocolBase.sol"];
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
subChainBaseAbi = subChainBaseOutput.contracts['SubChainBase.sol:SubChainBase'].interface;
subChainBaseBin = subChainBaseOutput.contracts['SubChainBase.sol:SubChainBase'].bytecode;
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
console.log("SubChainBase Contract compiled, size = " + subChainBaseBin.length + " " + green_check_mark);

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

    subChainBase = await deploySubChainBaseContractPromise();
    console.log("SubChainBase Contract deployed! address: "+ subChainBase.address + " " + green_check_mark);

    registerOpenResult = await registerOpenPromise();
    console.log("SubChainBase register open, hash: " + registerOpenResult + " " + green_check_mark);

    // wait for 10 blocks for all scs to send register tx
    _bc = await getBlockNumber();
    while(true) {
        bc = await getBlockNumber();
        if (bc > _bc + 10) {
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
}

main();

// For add fund to scsids
function sendMCPromise(src, dest, amount_in_mc) {
    return new Promise((resolve, reject) => {
        transaction = {
            from: src,
		    value: chain3.toSha(amount_in_mc,'mc'),
		    to: dest,
		    gas: "9000000",
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
            gas: "9000000"
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
            gas: "9000000"
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

// For deploy subchainbase
function deploySubChainBaseContractPromise(){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + subChainBaseBin,
            gas: "9000000"
        };
        subChainBaseContract.new(
            subChainProtocolBase.address,
            vnodeProtocolBase.address,
            minMember,
            maxMember,
            thousandth,
            flushRound,
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
		    gas: "9000000",
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
		    gas: "9000000",
		    data: subChainBase.registerAsMonitor.getData("0x" + scsid),
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
		    gas: "9000000",
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
function registerClosePromise(scsid) {
    return new Promise((resolve, reject) => {
        registerCloseTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "9000000",
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
		    gas: "9000000",
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
