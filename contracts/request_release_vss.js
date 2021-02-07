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

subchainbaseaddr = "0x03d60190c33a6b716fef08be1c964182e495f9ff"; // for vss test
subChainBase = chain3.mc.contract(JSON.parse(subChainBaseAbi)).at(subchainbaseaddr);
subchainprotocolbaseaddr = "0x67013bce15a69ca00a64b3c5e74fb052907c786b";
subChainProtocolBase = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi)).at(subchainprotocolbaseaddr);

async function main() {
    //scsNodeIndex = 2;
    scsNodeIndex = 5;
    scs_account = await subChainBase.nodeList.call(scsNodeIndex);
    chain3.personal.unlockAccount(scs_account, password, unlock_forever);
    console.log("Request release scs index:", scsNodeIndex, "addr:", scs_account);
    result = await requestReleaseSCSPromise(scsNodeIndex, scs_account);
    console.log("tx hash:", result, green_check_mark);
}

// For register scs to subchainbase as monitor
function requestReleaseSCSPromise(scsNodeIndex, scs_account) {
    return new Promise((resolve, reject) => {
        requestReleaseTransaction = {
            from: scs_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.requestRelease.getData(1, scsNodeIndex)
        };
        chain3.mc.sendTransaction(requestReleaseTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

main();
