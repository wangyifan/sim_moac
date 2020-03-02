const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setting
let vnodeLink = "vnode:50062";
let vnodeRpc = "vnode:8545";
let version = "dev";
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
let flushRound = 50;
let tokensupply = 3;
let exchangerate = 1;
let addFundAmount = 50;

let password = "1234567";
let threshold = 2;
let install_account = "0x64c2f81956ce75ef85e81534164f29a22d8a9d71";

scs_amount = 1000;
scsids = [
    "cf63506c6aea6fd30f602b3a565c29eb8a3fabe9",
    "18f1a9a6db02bfe950730f3734a38c354640ef64",
    "014e2cb023b445728abb134ee5ef9b72505814ec",
    //"a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    //"43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    //"8d26cd8257288a9f3fcb3c7a4b15ade3cf932925", // scs 3
    //"632774bf61ffc8873e43f3ce68cf3f169300efa3", // scs 4
    //"d7e1cf982f75563f166726a5814c7fa3c1948068", // scs 5
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

// compile dapp
dappFile = version + "/" + "dapp.sol";
dappContract = fs.readFileSync(dappFile, 'utf8');
dappOutput = solc.compile(dappContract, 1);
dappAbi = dappOutput.contracts[':helloWorld'].interface;
dappBin = dappOutput.contracts[':helloWorld'].bytecode;
console.log("dapp Contract compiled, size = " + dappBin.length + " " + green_check_mark);

// compile subchainprotocolbase
subChainProtocolBaseProtocol = "pos";
subChainProtocolBaseProtocolType = 0;
subChainProtocolBaseSolfile = version + "/" + "SubChainProtocolBase.sol";
subChainProtocolBaseContract = fs.readFileSync(subChainProtocolBaseSolfile, 'utf8');
subChainProtocolBaseOutput = solc.compile(subChainProtocolBaseContract, 1);
subChainProtocolBaseAbi = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].interface;
subChainProtocolBaseBin = subChainProtocolBaseOutput.contracts[':SubChainProtocolBase'].bytecode;
console.log("SubChainProtocolBase Contract compiled, size = " + subChainProtocolBaseBin.length + " " + green_check_mark);

// compile vssbase
vssbaseSolfile = version + "/" + "VssBase.sol";
vssbaseContract = fs.readFileSync(vssbaseSolfile, 'utf8');
vssbaseOutput = solc.compile(vssbaseContract, 1);
//console.log(vssbaseOutput);
vssbaseAbi = vssbaseOutput.contracts[':VssBase'].interface;
//console.log(vssbaseAbi);
vssbaseBin = vssbaseOutput.contracts[':VssBase'].bytecode;
console.log("Vssbase Contract compiled, size = " + vssbaseBin.length + " " + green_check_mark);

// compile subchainbase
subChainBaseFileName = "SubChainBaseRNG.sol";
subChainBaseSolfiles = [subChainBaseFileName, "SubChainProtocolBase.sol"];
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
    //console.log(subChainBaseOutput.errors);
}
subChainBaseAbi = subChainBaseOutput.contracts[subChainBaseFileName + ':SubChainBase'].interface;
//console.log(subChainBaseAbi);
subChainBaseBin = subChainBaseOutput.contracts[subChainBaseFileName + ':SubChainBase'].bytecode;
console.log("SubChainBase Contract compiled, size = " + subChainBaseBin.length + " " + green_check_mark);

// For add fund to scsids
function sendMCPromise(chain3_, src, dest, amount_in_mc) {
    return new Promise((resolve, reject) => {
        transaction = {
            from: src,
		    value: chain3_.toSha(amount_in_mc,'mc'),
		    to: dest,
		    gas: "200000",
		    data: ""
        };
        chain3_.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("sendMCPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For register scs to subchainbaseprotocol pool
function registerSCSSubChainProtocolBasePromise(chain3_, subChainProtocolBase_, scsid) {
    return new Promise((resolve, reject) => {
        data_ = subChainProtocolBase_.register.getData("0x" + scsid);
        console.log("register subchain protocol base [data]: " + data_);
        registerTransaction = {
            from: install_account,
		    to: subChainProtocolBase_.address,
		    gas: "1000000",
		    data: subChainProtocolBase_.register.getData("0x" + scsid),
            value: chain3_.toSha(bmin, 'mc')
        };
        chain3_.mc.sendTransaction(registerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("registerSCSSubChainProtocolBasePromise reject: " + e);
                reject(e);
            }
        });
    });
}

function getResetRNGGroupPromise(subchainbase, chain3) {
    return new Promise((resolve, reject) => {
        data_ = subchainbase.resetRNGGroup.getData();
        console.log("vssbase reset rng [data]: " + data_);
        transaction = {
            from: install_account,
		    to: subchainbase.address,
		    gas: "1000000",
		    data: subchainbase.resetRNGGroup.getData()
        };
        chain3.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("getResetRNGGroupPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For deploy subchainprotocolbase
function deploySubChainProtocolBaseContractPromise(subChainProtocolBaseContract){
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
                    console.log("deploySubChainProtocolBaseContractPromise reject: " + e);
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For deploy vnodeprotocolbase
function deployVssBaseContractPromise(vssBaseContract, threshold) {
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + vssbaseBin,
            gas: "9000000"
        };

        vssBaseContract.new(
            threshold,
            deployTransaction,
            (e, contract) => {
                if (e) {
                    console.log("deployVssBaseContractPromise reject: " + e);
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}

// For deploy vnodeprotocolbase
function deployVnodeProtocolBaseContractPromise(vnodeProtocolBaseContract) {
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

// For deploy dappbase
function deployDappBaseContractPromise(amount_in_mc, nonce, subChainBase, chain3_){
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

        chain3_.mc.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("deployDappBaseContractPromise reject: " + e);
                reject(e);
            }
        });
    });
}

module.exports = {
    install_account: install_account,
    scsids: scsids,
    scsmonitorids: scsmonitorids,
    vnodeLink: "vnode1:50062",
    vnodeRpc: "vnode1:8545",
    version: "dev",
    password: password,
    bmin: 2,
    unlock_forever: 0,
    chain3: new Chain3(),
    check_mark: "✓",
    RED: "\033[0,31m",
    GREEN: "\033[0,32m",
    NC: "\033[0m",
    green_check_mark: GREEN + check_mark + NC,
    subChainProtocolBase: null,
    vnodeProtocolBase: null,
    subChainBase: null,
    minMember: 1,
    maxMember: 31,
    thousandth: 1000,
    threshold: threshold,
    flushRound: 50,
    tokensupply: 3,
    exchangerate: 1,
    addFundAmount: 50,
    scs_amount: 1000,
    scsmonitorids: scsmonitorids,
    sendMCPromise: sendMCPromise,
    deploySubChainProtocolBaseContractPromise: deploySubChainProtocolBaseContractPromise,
    deployVnodeProtocolBaseContractPromise: deployVnodeProtocolBaseContractPromise,
    deployDappBaseContractPromise: deployDappBaseContractPromise,
    deployVssBaseContractPromise: deployVssBaseContractPromise,
    registerSCSSubChainProtocolBasePromise: registerSCSSubChainProtocolBasePromise,
    getResetRNGGroupPromise: getResetRNGGroupPromise,
    subChainProtocolBaseAbi: subChainProtocolBaseAbi,
    vnodeProtocolBaseAbi: vnodeProtocolBaseAbi,
    subChainBaseAbi: subChainBaseAbi,
    dappBaseAbi: dappBaseAbi,
    subChainProtocolBaseContract: subChainProtocolBaseContract,
    vssBaseAbi: vssbaseAbi,
};

