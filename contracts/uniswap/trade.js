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

    //////////////////////////////////////////////////////////////////////////////
    // Compile uniswap factory and pair
    //////////////////////////////////////////////////////////////////////////////

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
    pairABI = JSON.stringify(output.contracts['UniswapV2Pair.sol']['UniswapV2Pair'].abi);
    factoryABI = JSON.stringify(output.contracts['UniswapV2Factory.sol']['UniswapV2Factory'].abi);
    factoryAddr = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";
    factoryInstance = new web3.eth.Contract(JSON.parse(factoryABI), factoryAddr);

    //////////////////////////////////////////////////////////////////////////////
    // load pair contract
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    // get pair(token1, token2) contract
    token1 = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    token2 = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    pairAddr = await factoryInstance.methods.getPair(token1, token2).call();
    console.log("(token1, token2) pair: " + pairAddr);
    var pairContract = new web3.eth.Contract(JSON.parse(pairABI), pairAddr);
}

main();
