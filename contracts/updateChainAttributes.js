require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

let password = "123456";
let unlock_forever = 0;
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let chain3 = new Chain3();
let version = "dev";
let check_mark = "✓";
let RED = "\033[0;31m";
let GREEN = "\033[0;32m";
let NC = "\033[0m";
let green_check_mark = GREEN + check_mark + NC;
let chainAttributesContractAddress = "0x0000000000000000000000000000000000001000";

chainAttributesSolfile = version + "/" + "chainAttributes.sol";
chainAttributesContract = fs.readFileSync(chainAttributesSolfile, 'utf8');
chainAttributesOutput = solc.compile(chainAttributesContract, 1);
chainAttributesAbi = chainAttributesOutput.contracts[':ChainAttributes'].interface;
chainAttributesBin = chainAttributesOutput.contracts[':ChainAttributes'].bytecode;
console.log("chainAttributes Contract compiled, size = " + chainAttributesBin.length + " " + green_check_mark);

hostport = "http://"+ "172.20.0.11" + ":" + "8545";
chain3.setProvider(new chain3.providers.HttpProvider(hostport));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
chainAttributesContract = chain3.mc.contract(JSON.parse(chainAttributesAbi)).at(chainAttributesContractAddress);

function setOwner(owner) {
    return new Promise((resolve, reject) => {
        data_ = chainAttributesContract.setOwner.getData(owner);
        console.log("set owner [data]: " + data_);
        setOwnerTransaction = {
            from: install_account,
		    to: chainAttributesContract.address,
		    gas: "1000000",
		    data: data_
        };
        chain3.mc.sendTransaction(setOwnerTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("setOwnerPromise reject: " + e);
                reject(e);
            }
        });
    });
}

function setChainAttributesPromise(attrName, attrValue) {
    return new Promise((resolve, reject) => {
        data_ = chainAttributesContract.setAttribute.getData(attrName, attrValue);
        console.log("set chain attribute [data]: " + data_);
        setChainAttributeTransaction = {
            from: install_account,
		    to: chainAttributesContract.address,
		    gas: "1000000",
		    data: data_
        };
        chain3.mc.sendTransaction(setChainAttributeTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                console.log("setChainAttributesPromise reject: " + e);
                reject(e);
            }
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // set owner
    txHash = await setOwner(install_account);
    console.log("set owner txHash: " + txHash);

    // sleep for 5 seconds
    seconds = 5;
    console.log("sleep for "+ seconds + " seconds");
    await sleep(seconds*1000);

    // existing value should be empty string
    attrName = "BlockHeightLimit";
    attrValue = await chainAttributesContract.getAttribute.call(attrName);
    console.log("Existing attribute value: "+ attrName + " = \"" + attrValue+"\"");

    // update to 30000
    newAttrValue = "300";
    console.log("Set attribute value to: "+ attrName + " = " + newAttrValue);
    txHash = await setChainAttributesPromise(attrName, newAttrValue);
    console.log("Set chain attribute tx hash: " + txHash + " " +green_check_mark);

    // sleep for 15 seconds
    seconds = 15;
    console.log("sleep for "+ seconds + " seconds");
    await sleep(seconds*1000);

    console.log("query after update...");
    attrValue = await chainAttributesContract.getAttribute.call(attrName);
    console.log(attrName + ": \"" + attrValue+"\"");
}

main();
