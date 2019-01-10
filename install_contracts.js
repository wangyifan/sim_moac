const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setup
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let version = "1.0.6";
let password = "123456";
let bmin = 2;
let unlock_forever = 0;
let chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));



// For vnodeprotocolbase
let solfile = "contracts" + "/" + version + "/" + "VnodeProtocolBase.sol";
let contract = fs.readFileSync(solfile, 'utf8');
let output = solc.compile(contract, 1);
let abi = output.contracts[':VnodeProtocolBase'].interface;
let bin = output.contracts[':VnodeProtocolBase'].bytecode;
VnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(abi));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
deployTransaction = {
    from: install_account,
    data: '0x' + bin,
    gas: "9000000"
};

async function deployVnodeProtocolBaseContract(){
    contractPromise = new Promise((resolve, reject) => {
        VnodeProtocolBaseContract.new(bmin, deployTransaction, (e, contract) => {
            if (typeof contract.address !== 'undefined') {
                resolve(contract);
            }
        });
    });

    const contract = await contractPromise;
    console.log('VnodeProtocolBase Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
}

deployVnodeProtocolBaseContract();

// For subchainprotocolbase
let protocol = "pos";
let protocolType = 0;
solfile = "contracts" + "/" + version + "/" + "SubChainProtocolBase.sol";
contract = fs.readFileSync(solfile, 'utf8');
output = solc.compile(contract, 1);
abi = output.contracts[':SubChainProtocolBase'].interface;
bin = output.contracts[':SubChainProtocolBase'].bytecode;
SubChainProtocolBaseContract = chain3.mc.contract(JSON.parse(abi));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
deployTransaction = {
    from: install_account,
    data: '0x' + bin,
    gas: "9000000"
};

async function deploySubChainProtocolBaseContract(){
    contractPromise = new Promise((resolve, reject) => {
        SubChainProtocolBaseContract.new(protocol, bmin, protocolType, deployTransaction, (e, contract) => {
            if (typeof contract.address !== 'undefined') {
                resolve(contract);
            }
        });
    });

    const contract = await contractPromise;
    console.log('SubChainProtocolBase Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
}

deploySubChainProtocolBaseContract();
