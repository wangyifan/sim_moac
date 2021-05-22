require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

async function main() {
    contractAddressList = ["0xd33445423e6E9BD54eD3b9e539E770188683598C"];
    topics = ["0x342827c97908e5e2f71151c08502a66d44b6f758e3ac2f1de95f02eb95f0a735"];
    events = await web3.eth.getPastLogs({
        fromBlock: 5279700,
        toBlock: 5279710,
        address: contractAddressList,
        topics
    });
    console.log(events);
}

main();
