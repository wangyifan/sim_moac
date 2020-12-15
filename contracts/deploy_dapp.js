const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setting
let version = "dev";
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";


let password = "123456";
let unlock_forever = 0;
let chain3 = new Chain3();
let check_mark = "✓";
let RED = "\033[0;31m";
let GREEN = "\033[0;32m";
let NC = "\033[0m";
let green_check_mark = GREEN + check_mark + NC;
let subchainaddr = "0x67cdfb5fa248ca7e84840cf7f5ad4a09cb2fb1e7";
let value = chain3.toSha(5,'mc'); // should equal to totalsupply * exchange rate

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);

// compile dapp
contractName = ":crossChainRPC";
// contractName = ":helloWorld";
dappSolfile = version + "/" + "cross_chain_rpc_dapp.sol";
// dappSolfile = version + "/" + "dapp.sol";
dappContract = fs.readFileSync(dappSolfile, 'utf8');
dappOutput = solc.compile(dappContract, 1);
console.log(RED + dappOutput["errors"] + NC);
dappAbi = dappOutput.contracts[contractName].interface;
dappBin = dappOutput.contracts[contractName].bytecode;
dappContract = chain3.mc.contract(JSON.parse(dappAbi));
console.log("Dapp Contract compiled, size = " + dappBin.length + " " + green_check_mark);

async function main() {
    result  = await deployDappContractPromise(subchainaddr, "0x" + dappBin);
    console.log("Dapp Contract deployed! hash: " + result + " " + green_check_mark);
}

main();

// For deploy dapp
function deployDappContractPromise(subchainaddr, data) {
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            to: subchainaddr,
            data: data,
            gas: 0,
            value: value,
            shardingFlag: "0x1",
            nonce: 0,
            via: install_account
        };
        console.log(deployTransaction);
        chain3.mc.sendTransaction(deployTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}
