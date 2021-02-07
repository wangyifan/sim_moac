require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

const util = require('util');
const dcbase = require("./deploy_contracts_base_rng.js");
install_account = dcbase.install_account;
vnodeLink = dcbase.vnodeLink;
vnodeRpc = dcbase.vnodeRpc;
version = dcbase.version;
password = dcbase.password;
bmin = dcbase.bmin;
unlock_forever = dcbase.unlock_forever;
chain3 = dcbase.chain3;
check_mark = dcbase.check_mark;
RED = dcbase.RED;
GREEN = dcbase.GREEN;
NC = dcbase.NC;
green_check_mark = dcbase.green_check_mark;
subChainProtocolBase = dcbase.subChainProtocolBase;
vnodeProtocolBase = dcbase.vnodeProtocolBase;
subChainBase = dcbase.subChainBase;
minMember = dcbase.minMember;
maxMember = dcbase.maxMember;
thousandth = dcbase.thousandth;
threshold = dcbase.threshold;
flushRound = dcbase.flushRound;
tokensupply = dcbase.tokensupply;
exchangerate = dcbase.exchangerate;
addFundAmount = dcbase.addFundAmount;
scs_amount = dcbase.scs_amount;
scsids = dcbase.scsids;
scsmonitorids = dcbase.scsmonitorids;
sendMCPromise = dcbase.sendMCPromise;
registerSCSSubChainProtocolBasePromise = dcbase.registerSCSSubChainProtocolBasePromise;
getResetRNGGroupPromise = dcbase.getResetRNGGroupPromise;

hostport = "http://"+ "172.20.0.11" + ":" + "8545";
chain3.setProvider(new chain3.providers.HttpProvider(hostport));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));

subchainbaseaddr = "0x03d60190c33a6b716fef08be1c964182e495f9ff";
subChainBase = chain3.mc.contract(JSON.parse(subChainBaseAbi)).at(subchainbaseaddr);
subchainprotocolbaseaddr = "0x67013bce15a69ca00a64b3c5e74fb052907c786b";
subChainProtocolBase = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi)).at(subchainprotocolbaseaddr);
vssbaseaddr = "0xd6874f1d76130ea6dce3d37f97d33a9022ddd94d"; // for vss test
vssBase = chain3.mc.contract(JSON.parse(vssbaseAbi)).at(vssbaseaddr);

async function main() {
    // wait for 3000 ms
    waitLength = 3000;
    try {
        _bc = await getBlockNumber();
    } catch (e) {
    }

    while(true) {
        await sleep(1000);
        try {
            bc = await getBlockNumber();
        } catch (e) {
            //console.error(e);
        }
        await sleep(1000);
        if (bc > _bc + waitLength) {
            console.log("Wait block: " + bc);
            break;
        }
        try {

        }
    }
}

// For deploy dappbase
function callDappBaseRandomPromise(amount_in_mc, nonce, subChainBase, chain3_){
    return new Promise((resolve, reject) => {
        dappBaseContract = chain3_.mc.contract(JSON.parse(dappBaseAbi));
        data = dappBaseContract.new.getData("random");

        deployTransaction = {
            from: install_account,
            value: 0,
            to: subChainBase.address,
            gas: "0",
            gasPrice: chain3.mc.gasPrice,
            shardingFlag: "0x3",
            data: '0x' + data,
            nonce: nonce,
            via: install_account
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

// get blocknumber
function getBlockNumber() {
    return new Promise((resolve, reject) => {
        chain3.mc.getBlockNumber((e, blocknumber) => {
            if (!e) {
                resolve(blocknumber);
            } else {
                //console.log("getBlockNumber reject: " + e);
                reject(e);
            }
        });
    }).catch("getblocknumber error");
}

// call getSCSRole
function getSCSRolePromise(scsid, chain3) {
    return new Promise((resolve, reject) => {
        getscsroleTransaction = {
		    to: subChainBase.address,
		    data: subChainBase.getSCSRole.getData(scsid)
        };
        chain3.mc.call(getscsroleTransaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
                reject(e);
            }
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
