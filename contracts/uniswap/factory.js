require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
//var web3 = new Web3('http://172.20.0.11:8545');
var web3 = new Web3('http://127.0.0.1:8545');
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

    //////////////////////////////////////////////////////////////////////////////
    // Compile uniswap factory and pair
    //////////////////////////////////////////////////////////////////////////////
    /*
    uniswapFactoryInterfaceFile = contract_dir + "/" + "IUniswapV2Factory.sol";
    uniswapFactoryInterfaceContent = fs.readFileSync(uniswapFactoryInterfaceFile, 'utf8');

    uniswapERC20InterfaceFile = contract_dir + "/" + "IUniswapV2ERC20.sol";
    uniswapERC20InterfaceContent = fs.readFileSync(uniswapERC20InterfaceFile, 'utf8');

    uniswapPairInterfaceFile = contract_dir + "/" + "IUniswapV2Pair.sol";
    uniswapPairInterfaceContent = fs.readFileSync(uniswapPairInterfaceFile, 'utf8');

    uniswapCalleeInterfaceFile = contract_dir + "/" + "IUniswapV2Callee.sol";
    uniswapCalleeInterfaceContent = fs.readFileSync(uniswapCalleeInterfaceFile, 'utf8');

    erc20InterfaceFile = contract_dir + "/" + "IERC20.sol";
    erc20InterfaceContent = fs.readFileSync(erc20InterfaceFile, 'utf8');

    uniswapFactoryFile = contract_dir + "/" + "UniswapV2Factory.sol";
    uniswapFactoryContent = fs.readFileSync(uniswapFactoryFile, 'utf8');

    uniswapPairFile = contract_dir + "/" + "UniswapV2Pair.sol";
    uniswapPairContent = fs.readFileSync(uniswapPairFile, 'utf8');

    uniswapERC20File = contract_dir + "/" + "UniswapV2ERC20.sol";
    uniswapERC20Content = fs.readFileSync(uniswapERC20File, 'utf8');

    mathFile = contract_dir + "/" + "Math.sol";
    mathContent = fs.readFileSync(mathFile, 'utf8');

    safemathFile = contract_dir + "/" + "SafeMath.sol";
    safemathContent = fs.readFileSync(safemathFile, 'utf8');

    uq112File = contract_dir + "/" + "UQ112x112.sol";
    uq112Content = fs.readFileSync(uq112File, 'utf8');

    input = {
        language: 'Solidity',
        sources: {
            'IUniswapV2Factory.sol': {
                content: uniswapFactoryInterfaceContent
            },
            'UniswapV2Pair.sol': {
                content: uniswapPairContent
            },
            'UniswapV2Factory.sol' : {
                content: uniswapFactoryContent
            },
            'Math.sol': {
                content: mathContent
            },
            'UQ112x112.sol': {
                content: uq112Content
            },
            'SafeMath.sol': {
                content: safemathContent
            },
            'IUniswapV2ERC20.sol': {
                content: uniswapERC20InterfaceContent
            },
            'IUniswapV2Pair.sol': {
                content: uniswapPairInterfaceContent
            },
            'IUniswapV2Callee.sol': {
                content: uniswapCalleeInterfaceContent
            },
            'IERC20.sol': {
                content: erc20InterfaceContent
            },
            'UniswapV2ERC20.sol': {
                content: uniswapERC20Content
            },
            'SafeMath.sol': {
                content: safemathContent
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    console.log(solc.semver());
    output = JSON.parse(solc.compile(JSON.stringify(input)));
    factoryABI = JSON.stringify(output.contracts['UniswapV2Factory.sol']['UniswapV2Factory'].abi);
    factoryBytecode = output.contracts['UniswapV2Factory.sol']['UniswapV2Factory'].evm.bytecode.object;
    console.log(factoryABI);
    console.log(factoryBytecode);
    */

    // do not compile factory, use the pre-compiled version instead
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

    //token1 = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    //token2 = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    token1 = "0x67cDfB5FA248Ca7E84840Cf7f5AD4A09Cb2Fb1e7";
    token2 = "0x7C0d5C71A89AaF27b4221a1B0a38070179190729";
    pairAddr = await uniswapFactoryInstance.methods.createPair(token1, token2).send({from: install_account, gas: '6000000'});
    console.log(pairAddr);

    getPairResult = await uniswapFactoryInstance.methods.getPair(token1, token2).call();
    console.log("(token1, token2) pair: " + getPairResult);
    getPairResult = await uniswapFactoryInstance.methods.getPair(token2, token1).call();
    console.log("(token2, token1) pair: " + getPairResult);
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
        gas: 9000000
    });
}

main();
