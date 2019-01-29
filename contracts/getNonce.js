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
let argument = [3];
let version = "dev";

async function main() {
    nonce = await getNonce(rpcurl, subchainaddr, senderaddr);
    console.log(nonce);
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
