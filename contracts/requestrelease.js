const dcbase = require("./deploy_contracts_base.js");
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

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));

subchainbaseaddr = "0xd6874f1d76130ea6dce3d37f97d33a9022ddd94d";
subChainBase = chain3.mc.contract(JSON.parse(subChainBaseAbi)).at(subchainbaseaddr);
subchainprotocolbaseaddr = "0x67013bce15a69ca00a64b3c5e74fb052907c786b";
subChainProtocolBase = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi)).at(subchainprotocolbaseaddr);

async function main() {
    scsNodeIndex = 2; //scs3
    result = await requestReleaseSCSPromise(scsNodeIndex);
    console.log("Request release scs ", scsNodeIndex, " ", green_check_mark, " tx = ", result);
}

// For register scs to subchainbase as monitor
function requestReleaseSCSPromise(scsNodeIndex) {
    return new Promise((resolve, reject) => {
        requestReleaseTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "10000000",
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
