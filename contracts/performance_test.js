const Chain3 = require("chain3");

let check_mark = "✓";
let RED = "\033[0;31m";
let GREEN = "\033[0;32m";
let NC = "\033[0m";
let green_check_mark = GREEN + check_mark + NC;
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
let password = "123456";
let unlock_forever = 0;

chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);

scsids = [
    "a63a7764d01a6b11ba628f06b00a1828e5955a7f", // scs 1
    "43c375d09e8a528770c6e1c76014cc9f4f9139a3", // scs 2
    "8d26cd8257288a9f3fcb3c7a4b15ade3cf932925", // scs 3
    "632774bf61ffc8873e43f3ce68cf3f169300efa3", // scs 4
    "d7e1cf982f75563f166726a5814c7fa3c1948068", // scs 5
];

async function main() {
    for (j = 0; j < 80000; j++ ) {
        for (i = 0; i < scsids.length; i++) {
            scsid = scsids[i];
            scs_amount = 0.0001;
            result = await sendMCPromise(chain3, install_account, scsid, scs_amount);
            console.log("Sent " + scs_amount + " mc to scsid " + scsid + " " + green_check_mark);
        }
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
