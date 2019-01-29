const fs = require("fs");
const request = require('request');
const Chain3 = require("chain3");
const solc = require("solc");
const Web3 = require("web3");

// global setting
let subchainaddr = "0x67cdfb5fa248ca7e84840cf7f5ad4a09cb2fb1e7";
let senderaddr = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let unlock_forever = 0;
let chain3 = new Chain3();
let web3 = new Web3();
let password = "123456";
let monitor_rpc = "http://localhost:52163";
let rpcurl  = monitor_rpc + "/" + "rpc";
let method = "callRPC";
let argument = ["0x67cdfb5fa248ca7e84840cf7f5ad4a09cb2fb1e7", "save(string,uint256,bool)", "hello world", 3, true];
let version = "dev";

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(senderaddr, password, unlock_forever);

// compile dapp
dappContractClass = ":crossChainRPC";
dappSolfile = version + "/" + "cross_chain_rpc_dapp.sol";
dappContract = fs.readFileSync(dappSolfile, 'utf8');
dappOutput = solc.compile(dappContract, 1);
dappAbi = dappOutput.contracts[dappContractClass].interface;
dappBin = dappOutput.contracts[dappContractClass].bytecode;
dappContract = chain3.mc.contract(JSON.parse(dappAbi));
console.log("Dapp crossChainRPC contract compiled, size = " + dappBin.length);

async function main() {
    nonce = await getNonce(rpcurl, subchainaddr, senderaddr);
    data = web3.eth.abi.encodeFunctionCall(
        getSig(dappContract, method),
        argument
    );
    console.log(nonce, data);
    result  = await callDappContractPromise(subchainaddr, senderaddr, senderaddr, data, nonce);
    console.log("Subchain call, data: " + data + " nonce: " + nonce + " hash: " + result);
}

main();

function getNonce(rpcurl, subchainaddr, senderaddr) {
    return new Promise((resolve, reject) => {
        data = {
            "jsonrpc": "2.0",
            "id": 0,
            "method":"ScsRPCMethod.GetNonce",
            "params":{
                "SubChainAddr": subchainaddr,
                "Sender": senderaddr
            }
        };

        params = {
            uri: rpcurl,
            method: "POST",
            json: true,
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        request(
            params,
            (e, response, result) => {
                if (e) {
                    reject(e);
                }

                if (!e && response.statusCode == 200) {
                    resolve(parseInt(result['result']));
                }
            });
    });
}

function getSig(contract, funcname) {
    for(i = 0;i < contract.abi.length; i++) {
        if (contract.abi[i]["name"] == funcname) {
            return contract.abi[i];
        }
    }

    return undefined;
}

// For deploy dapp
function callDappContractPromise(subchainaddr, senderaddr, via, data, nonce) {
    return new Promise((resolve, reject) => {
        callTransaction = {
            from: senderaddr,
            to: subchainaddr,
            data: data,
            gas: 0,
            value: 0,
            shardingFlag: "0x1",
            nonce: nonce,
            via: via
        };
        console.log(callTransaction);
        chain3.mc.sendTransaction(callTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}
