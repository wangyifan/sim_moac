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
            //console.log(subChainProtocolBase.scsList("0x" + scsid));
            if (subChainProtocolBase.isPerforming("0x" + scsid)) {
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

    result = await getSCSRolePromise("0x"+ scsids[0]);
    console.log("get scs role promise for ", scsids[0], "with result ", result);

    nodetoadd = 10;
    result = await registerAddPromise(nodetoadd);
    console.log("Register add result with " + result + " " +green_check_mark);


    result = await getResetRNGGroupPromise(subChainBase);
    console.log("reset rng group " + green_check_mark);
}

// call registeradd to subchainbase
function registerAddPromise(nodetoadd) {
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

// call getSCSRole
function getSCSRolePromise(scsid) {
    return new Promise((resolve, reject) => {
        registerAddTransaction = {
		    to: subChainBase.address,
		    data: subChainBase.getSCSRole.getData(scsid)
        };
        chain3.mc.call(registerAddTransaction, (e, result) => {
            if (!e) {
                resolve(result);
            } else {
                reject(e);
            }
        });
    });
}

main();
