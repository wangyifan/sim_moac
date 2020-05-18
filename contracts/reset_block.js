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
//scsids = dcbase.scsids;
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
vssbaseaddr = "0xd6874f1d76130ea6dce3d37f97d33a9022ddd94d"; // for vss test
vssbase = chain3.mc.contract(JSON.parse(vssbaseAbi)).at(vssbaseaddr);


async function main() {
    console.log(
        "subchainbase: " + subchainbaseaddr + "\n subChainProtocolBase: "
            + subchainprotocolbaseaddr + "\n vssbase: " + vssbaseaddr
    );

    while (true) {
        result = await resetSubchainPromise(chain3);
        console.log("reset subchainbase with hash: " + result + " " + green_check_mark);

        // randomly sleep between [100, 280] seconds
        seconds = getRandomInt(50) + 150;
        console.log("after reset sleep: " + seconds.toString());
        await sleep(1000*seconds);
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resetSubchainPromise(chain3) {
    return new Promise((resolve, reject) => {
        resetVSSGroupTransaction = {
            from: install_account,
		    to: subChainBase.address,
            gas: "1000000",
		    data: subChainBase.reset.getData()
        };
        chain3.mc.sendTransaction(resetVSSGroupTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

main();
