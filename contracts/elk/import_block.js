require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
const Chain3 = require("chain3");

chain3 = new Chain3();
check_mark = "✓";
RED = "\033[0;31m";
GREEN = "\033[0;32m";
NC = "\033[0m";
green_check_mark = GREEN + check_mark + NC;
hostport = "http://"+ "127.0.0.1" + ":" + "18545";
chain3.setProvider(new chain3.providers.HttpProvider(hostport));

async function main() {
    while(true) {
        await sleep(2000);
        blockNumber = await getBlockNumber();
        console.log("Current vnode block: "+ blockNumber + " " + green_check_mark);
        block = await getBlockByNumber();
        console.log("Current vnode block: "+JSON.stringify(block));
    }
}

main();

// get blocknumber
function getBlockNumber() {
    return new Promise((resolve, reject) => {
        chain3.mc.getBlockNumber((e, blocknumber) => {
            if (!e) {
                resolve(blocknumber);
            } else {
                reject(e);
            }
        });
    }).catch("getblocknumber error");
}

// get blocknumber
function getBlockByNumber(blockNumer) {
    return new Promise((resolve, reject) => {
        chain3.mc.getBlock(blockNumber, (e, block) => {
            if (!e) {
                resolve(block);
            } else {
                reject(e);
            }
        });
    }).catch("getblocknumber error");
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
