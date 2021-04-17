const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");
const Web3 = require("web3");

// global setting
let vnodeLink = "vnode:50062";
let vnodeRpc = "vnode:8545";
let version = "dev";
let bmin = 2;
let unlock_forever = 0;
let chain3 = new Chain3();
let web3 = new Web3();
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
let useChain3 = false;

install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
password = "123456";
threshold = 8;

scs_amount = 1000;
scsids = [
    "a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    "43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    "8d26cd8257288a9f3fcb3c7a4b15ade3cf932925", // scs 3
    "632774bf61ffc8873e43f3ce68cf3f169300efa3", // scs 4
    "d7e1cf982f75563f166726a5814c7fa3c1948068", // scs 5
    "30601cba96b98f22d5c46bb8a8b0b298b8017ef2", // scs 6
    "c24c73cfb25e444fb20c3405a8327808303f4040", // scs 7
    "78c013c83884b9b88fb067ed0d49c02a4421ce2a", // scs 8
    "0d12d784ba0cb4d4d053f1e2d34b58bb1c4587f5", // scs 9
    "5198d17356857f68bbb58aa8b73494d5513887c3", // scs 10
    "66febe4b3b4282536e6a40eab65d8f91c3e906cc", // scs 11
    "f567675ab59d93e3f6716bbf79a843840ab60d81", // scs 12
];

subChainBaseFileName = "SubChainBaseRNG.sol";
//subChainBaseFileName = "SubChainBaseRNG_V2.sol";
//subChainBaseFileName = "SubChainBaseRNG_ORI.sol";

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
// dappBaseFile = version + "/" + "dappbase.sol";
dappBaseFile = version + "/" + "DappBasePublic.sol";
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
//subChainBaseBin = fs.readFileSync("dev/randdrop_asm.txt").toString("ascii");
//console.log("111" + subChainBaseBin);
console.log("SubChainBase Contract compiled, size = " + subChainBaseBin.length + " " + green_check_mark);

function convertUnit(amount_in_chain) {
    if (useChain3 == true) {
        return sdk3.toSha(amount_in_chain, 'mc');
    } else {
        return sdk3.utils.toWei(amount_in_chain.toString(), 'ether');
    }
}

// For add fund to scsids
function sendPromise(sdk3, sdk3Chain, src, dest, amount_in_chain) {
    return new Promise((resolve, reject) => {
        transaction = {
            from: src,
		    value: convertUnit(amount_in_chain),
		    to: dest,
		    gas: "200000",
		    data: ""
        };
        sdk3Chain.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("sendPromise reject: " + e);
                reject(e);
            }
        });
    });
}

// For register scs to subchainbaseprotocol pool
function registerSCSSubChainProtocolBasePromise(sdk3, sdk3Chain, subChainProtocolBase_, scsid) {
    return new Promise((resolve, reject) => {
        if (useChain3) {
            data_ = subChainProtocolBase_.register.getData("0x" + scsid);
            to = subChainProtocolBase_.address;
        } else {
            data_ = subChainProtocolBase_.methods.register("0x" + scsid).encodeABI();
            to = subChainProtocolBase_.options.address;
        }
        console.log("register subchain protocol base [data]: " + data_ + " " + green_check_mark);
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

function getResetRNGGroupPromise(subchainbase, sdk3, sdk3Chain) {
    return new Promise((resolve, reject) => {
        if (useChain3) {
            data_ = subchainbase.resetRNGGroup.getData();
            to = subchainbase.address;
        } else {
            data_ = subchainbase.methods.resetRNGGroup().encodeABI();
            to = subchainbase.options.address;
        }
        console.log("vssbase reset rng [data]: " + data_);
        transaction = {
            from: install_account,
		    to: to,
		    gas: "1000000",
		    data: data_
        };
        sdk3Chain.sendTransaction(transaction, (e, transactionHash) => {
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
    if (useChain3) {
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
    } else {
        return subChainProtocolBaseContract.deploy({
            data: '0x' + subChainProtocolBaseBin,
            arguments: [subChainProtocolBaseProtocol, bmin, subChainProtocolBaseProtocolType]
        }).send({
            from: install_account,
            gas: "9000000"
        });
    }
}

// For deploy vnodeprotocolbase
function deployVssBaseContractPromise(vssBaseContract, threshold) {
    if (useChain3) {
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
    } else {
        return vssBaseContract.deploy({
            data: '0x' + vssbaseBin,
            arguments: [threshold]
        }).send({
            from: install_account,
            gas: "9000000"
        });
    }
}

// For deploy vnodeprotocolbase
function deployVnodeProtocolBaseContractPromise(vnodeProtocolBaseContract, gas) {
    if (useChain3) {
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
    } else {
        return vnodeProtocolBaseContract.deploy({
            data: '0x' + vnodeProtocolBaseBin,
            arguments: [bmin]
        }).send({
            from: install_account,
            gas: gas
        });
    }
}

// For deploy dappbase
function deployDappBaseContractPromise(amount_in_chain, nonce, subChainBase, sdk3, sdk3Chain){
    return new Promise((resolve, reject) => {
        dappBaseContract = sdk3Chain.contract(JSON.parse(dappBaseAbi));
        data = dappBaseContract.new.getData(
            "testcoin",
            false,
            {data:dappBaseBin});

        deployTransaction = {
            from: install_account,
            value: convertUnit(amount_in_chain),
            to: subChainBase.address,
            gas: "0",
            gasPrice: sdk3Chain.gasPrice,
            shardingFlag: "0x3",
            data: '0x' + data,
            nonce: nonce,
            via: install_account
        };

        sdk3Chain.sendTransaction(deployTransaction, (e, transactionHash) => {
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
    useChain3: useChain3,
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
    web3: new Web3(),
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
    convertUnit: convertUnit,
    sendPromise: sendPromise,
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
    vnodeProtocolBaseBin: vnodeProtocolBaseBin
};

