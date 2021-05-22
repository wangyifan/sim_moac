require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
var web3 = new Web3('http://172.20.0.11:8545');
//var web3 = new Web3('http://127.0.0.1:8545');
var solc = require("solc");
var fs = require("fs");
const { get } = require('http');

// for colorful console log
var check_mark = "✓";
var RED = "\033[0;31m";
var GREEN = "\033[0;32m";
var NC = "\033[0m";
var green_check_mark = GREEN + check_mark + NC;

// contract dirrectory
var contract_dir = "uniswap_contracts";


async function main() {
    factoryPrecompileFile = contract_dir + "/" + "UniswapV2Factory.json";
    factoryPrecompileFileContent = fs.readFileSync(factoryPrecompileFile, 'utf8');

    factoryPrecompile = JSON.parse(factoryPrecompileFileContent);
    factoryABI = JSON.stringify(factoryPrecompile["abi"]);
    factoryBytecode = factoryPrecompile["bytecode"];

    //////////////////////////////////////////////////////////////////////////////
    // deploy contracts
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);
    var uniswapFactoryContract = new web3.eth.Contract(JSON.parse(factoryABI));
    var uniswapFactoryInstance = await deployUniswapFactoryV2Contract(
        install_account,
        factoryBytecode,
        uniswapFactoryContract
    );
    console.log("uniswap factory deployed: " + uniswapFactoryInstance.options.address + " " + green_check_mark);

    token1 = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    token2 = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    token3 = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";
    //token1 = "0x192158e8825AB10FED009b229E67F4c2f9ceb275";
    //token2 = "0x5343D3092041c3fC1608D76a15Db3b1879315509";
    //token3 = "0xA331080bE3eE507788839E730982483906bbeFe0";
    pairAddr1 = await uniswapFactoryInstance.methods.createPair(token1, token2).send({from: install_account, gas: '3000000'});
    console.log(pairAddr1);
    pairAddr2 = await uniswapFactoryInstance.methods.createPair(token2, token3).send({from: install_account, gas: '3000000'});
    console.log(pairAddr2);

    getPairResult = await uniswapFactoryInstance.methods.getPair(token1, token2).call();
    console.log("(token1, token2) pair: " + getPairResult);
    getPairResult = await uniswapFactoryInstance.methods.getPair(token2, token1).call();
    console.log("(token2, token1) pair: " + getPairResult);

    getPairResult = await uniswapFactoryInstance.methods.getPair(token2, token3).call();
    console.log("(token2, token3) pair: " + getPairResult);
    getPairResult = await uniswapFactoryInstance.methods.getPair(token3, token2).call();
    console.log("(token3, token2) pair: " + getPairResult);
}

// For deploy uniswap factory v2
function deployUniswapFactoryV2Contract(install_account, contractBytecode, uniswapFactoryContract){
    return uniswapFactoryContract.deploy(
        {
            data: '0x' + contractBytecode,
            arguments: [install_account]
        }
    ).send({
        from: install_account,
        gas: 7000000
    });
}

main();
