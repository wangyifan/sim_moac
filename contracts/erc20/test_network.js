require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var network = "http://gateway.moac.io:8545/mainnet";
var Web3 = require('web3');
var web3 = new Web3(network);

// for colorful console log
var check_mark = "✓";
var RED = "\033[0;31m";
var GREEN = "\033[0;32m";
var NC = "\033[0m";
var green_check_mark = GREEN + check_mark + NC;

async function main() {
    chainID = await web3.eth.getChainId();
    console.log("network chain id: ", chainID);
}

main();
