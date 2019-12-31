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
    console.log("subchainbase: " + subchainbaseaddr + " subChainProtocolBase: " + subchainprotocolbaseaddr);
    scsids = ["30601cba96b98f22d5c46bb8a8b0b298b8017ef2"]; //scs6
    // send money
    for (i = 0; i < scsids.length; i++) {
        scsid = scsids[i];
        result = await sendMCPromise(chain3, install_account, scsid, scs_amount);
        console.log("Sent " + scs_amount + " mc to scsid " + scsid + " " + green_check_mark);
    }

    // register with subchain protocol pool
    for (i = 0; i < scsids.length; i++) {
        scsid = scsids[i];
        result = await registerSCSSubChainProtocolBasePromise(chain3, subChainProtocolBase, scsid);
    }

    // wait for scs to perform
    performingSCS = [];
    while(true) {
        allPerforming = true;
        for (i = 0; i < scsids.length; i++) {
            scsid = scsids[i];
            isPerforming = await subChainProtocolBase.isPerforming("0x" + scsid);
            try {
                bc = await getBlockNumber();
            } catch (e) {
                continue;
            }
            console.log("isPerforming for " + "0x" + scsid + ": " + isPerforming + ", block: " + bc);
            if (isPerforming) {
                if (performingSCS.indexOf(scsid) == -1) {
                    console.log("Registered scs: " + scsid + " with pool " + green_check_mark);
                    performingSCS.push(scsid);
                }
            } else {
                allPerforming = false;
            }
        }

        if (allPerforming) {
            break;
        }
    }

    result = await subChainBase.getSCSRole("0x" + scsids[0]);
    console.log("get scs role promise for ", scsids[0], "with result ", result.toNumber());

    nodetoadd = 10;
    result = await registerAddPromise(nodetoadd, chain3);
    console.log("Register add result with " + result + " " +green_check_mark);

    nodeCount = 0;
    while(true) {
        try {
            nodeCount = await subChainBase.nodeCount();
            bc = await getBlockNumber();
            joinCntNow = await subChainBase.joinCntNow();
            nodesToJoin = [];
            nodesPerformance = {};
            for(i = 0; i < joinCntNow; i++) {
                node = await subChainBase.nodesToJoin(i);
                nodesToJoin.push(node);
                performance = await subChainBase.nodePerformance(node);
                nodesPerformance[node] = performance.toNumber();
            }
        } catch (e) {
            console.log(e);
            continue;
        }
        console.log("nodeCount: " + nodeCount + " block number: " + bc + " nodesToJoin: " + util.inspect(nodesPerformance) + " joinCntNow: " + joinCntNow);
        await sleep(1000);
    }
}

// call registeradd to subchainbase
function registerAddPromise(nodetoadd, chain3) {
    return new Promise((resolve, reject) => {
        registerAddTransaction = {
            from: install_account,
		    to: subChainBase.address,
		    gas: "1000000",
		    data: subChainBase.registerAdd.getData(nodetoadd)
        };
        chain3.mc.sendTransaction(registerAddTransaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}

function getSCSRolePromise(scsid, chain3) {
    return new Promise((resolve, reject) => {
        getSCSRoleTransaction = {
		    to: subChainBase.address,
		    data: subChainBase.getSCSRole.getData(scsid)
        };
        chain3.mc.call(getSCSRoleTransaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();

