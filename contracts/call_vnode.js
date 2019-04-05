const fs = require("fs");
const Chain3 = require("chain3");
const solc = require("solc");

// global setting
let version = "dev";
let install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";


let password = "123456";
let unlock_forever = 0;
let chain3 = new Chain3();
let check_mark = "✓";
let RED = "\033[0;31m";
let GREEN = "\033[0;32m";
let NC = "\033[0m";
let green_check_mark = GREEN + check_mark + NC;
let subchainaddr = "0x67cdfb5fa248ca7e84840cf7f5ad4a09cb2fb1e7";
let value = chain3.toSha(2,'mc'); // should equal to totalsupply * exchange rate

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:52159'));
chain3.personal.unlockAccount(install_account, password, unlock_forever);

subChainBaseSolfiles = ["SubChainBase.sol", "SubChainProtocolBase.sol"];
subChainBaseInput = {};
subChainBaseSolfiles.forEach(fileName => {
    file = fs.readFileSync(version + "/" + fileName, 'utf8');
    subChainBaseInput[fileName] = file;
});
subChainBaseOutput = solc.compile(
    {
        sources: subChainBaseInput,
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    1
);
subChainBaseAbi = subChainBaseOutput.contracts['SubChainBase.sol:SubChainBase'].interface;
subChainBaseBin = subChainBaseOutput.contracts['SubChainBase.sol:SubChainBase'].bytecode;
subChainBaseContract = chain3.mc.contract(JSON.parse(subChainBaseAbi)).at(subchainaddr);
console.log("SubChainBase Contract compiled, size = " + subChainBaseBin.length + " " + green_check_mark);

async function main() {
    index = 0;
    result = getRNGNodeAddr(index);
    console.log(result);
    result = getRNGNodeIndex(result);
    console.log(result);
    index = 1;
    result = getRNGNodeAddr(index);
    console.log(result);
    result = getRNGNodeIndex(result);
    console.log(result);
    index = 2;
    result = getRNGNodeAddr(index);
    console.log(result);
    result = getRNGNodeIndex(result);
    console.log(result);
}

main();

function getRNGNodeIndex(addr) {
    getRNGNodeAddrCall = {
		to: subchainaddr,
		data: subChainBaseContract.rngNodeIndex.getData(addr)
    };
    return chain3.mc.call(getRNGNodeAddrCall);
}

function getRNGNodeAddr(index) {
    getRNGNodeIndexCall = {
		to: subchainaddr,
		data: subChainBaseContract.rngMemberList.getData(index)
    };
    return chain3.mc.call(getRNGNodeIndexCall);
}
