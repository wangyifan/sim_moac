const dcbase = require("./deploy_contracts_base.js");
chain3 = dcbase.chain3;
check_mark = dcbase.check_mark;
RED = dcbase.RED;
GREEN = dcbase.GREEN;
NC = dcbase.NC;
green_check_mark = dcbase.green_check_mark;
install_account = dcbase.install_account;
password = dcbase.password;
unlock_forever = dcbase.unlock_forever;
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);
deploySubChainProtocolBaseContractPromise = dcbase.deploySubChainProtocolBaseContractPromise;
deployVnodeProtocolBaseContractPromise = dcbase.deployVnodeProtocolBaseContractPromise;
deployDappBaseContractPromise = dcbase.deployDappBaseContractPromise;
vnodeProtocolBaseContract = chain3.mc.contract(JSON.parse(vnodeProtocolBaseAbi));
subChainProtocolBaseContract = chain3.mc.contract(JSON.parse(subChainProtocolBaseAbi));
dappBaseContract = chain3.mc.contract(JSON.parse(dappBaseAbi));

scsids = [
    "a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    "43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    "8d26cd8257288a9f3fcb3c7a4b15ade3cf932925", // scs 3
    "632774bf61ffc8873e43f3ce68cf3f169300efa3", // scs 4
    "d7e1cf982f75563f166726a5814c7fa3c1948068", // scs 5
];

async function main() {
    for (j = 0; j < 100; j++ ) {
        for (i = 0; i < 100 ; i++) {
            scsid = scsids[i%scsids.length];
            scs_amount = 0.0001;
            result = await sendMCPromise(chain3, install_account, scsid, scs_amount);
            console.log("Sent " + scs_amount + " mc to scsid " + scsid + " " + green_check_mark);
        }

        result = await deploySubChainProtocolBaseContractPromise(subChainProtocolBaseContract);
        console.log("subchain protocol base deployed " + result + " " + green_check_mark);
        result = await deployVnodeProtocolBaseContractPromise();
        console.log("vnode protocol base deployed " + result + " " + green_check_mark);
    }
}

main();

// For add fund to scsids
function sendMCPromise(chain3_, src, dest, amount_in_mc) {
    return new Promise((resolve, reject) => {
        transaction = {
            from: src,
		    value: chain3_.toSha(amount_in_mc,'mc'),
		    to: dest,
		    gas: "22000",
		    data: ""
        };
        chain3_.mc.sendTransaction(transaction, (e, transactionHash) => {
            if (!e) {
                resolve(transactionHash);
            } else {
                reject(e);
            }
        });
    });
}
