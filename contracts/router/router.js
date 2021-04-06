require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
//var web3 = new Web3('http://172.20.0.11:8545');
var web3 = new Web3('http://127.0.0.1:18545');
var solc = require("solc");
var fs = require("fs");

// for colorful console log
var check_mark = "✓";
var RED = "\033[0;31m";
var GREEN = "\033[0;32m";
var NC = "\033[0m";
var green_check_mark = GREEN + check_mark + NC;

async function main() {
    //////////////////////////////////////////////////////////////////////////////
    // Compile erc20
    //////////////////////////////////////////////////////////////////////////////

    uniswapInterfaceFactoryFile = "IUniswapV2Factory.sol";
    uniswapInterfaceFactoryContent = fs.readFileSync(uniswapInterfaceFactoryFile, 'utf8');

    transferHelperFile = "TransferHelper.sol";
    transferHelperContent = fs.readFileSync(transferHelperFile, 'utf8');

    uniswapInterfaceRouter01File = "IUniswapV2Router01.sol";
    uniswapInterfaceRouter01Content = fs.readFileSync(uniswapInterfaceRouter01File, 'utf8');

    uniswapInterfaceRouter02File = "IUniswapV2Router02.sol";
    uniswapInterfaceRouter02Content = fs.readFileSync(uniswapInterfaceRouter02File, 'utf8');

    uniswaplibFile = "UniswapV2Library.sol";
    uniswaplibContent = fs.readFileSync(uniswaplibFile, 'utf8');

    safemathFile = "SafeMath.sol";
    safemathContent = fs.readFileSync(safemathFile, 'utf8');

    erc20interfaceFile = "IERC20.sol";
    erc20interfaceContent = fs.readFileSync(erc20interfaceFile, 'utf8');

    wmoacinterfacefile = "IWMOAC.sol";
    wmoacinterfaceContent = fs.readFileSync(wmoacinterfacefile, 'utf8');

    wmoacfile = "WMOAC.sol";
    wmoacContent = fs.readFileSync(wmoacfile, 'utf8');

    uniswapinterfacePairFile = "IUniswapV2Pair.sol";
    uniswapinterfacePairContent = fs.readFileSync(uniswapinterfacePairFile, 'utf8');

    uniswapRouter02File = "UniswapV2Router02.sol";
    uniswapRouter02Content = fs.readFileSync(uniswapRouter02File, 'utf8');

    var input = {
        language: 'Solidity',
        sources: {
            'UniswapV2Router02.sol': {
                content: uniswapRouter02Content
            },
            'IUniswapV2Pair.sol':{
                content: uniswapinterfacePairContent
            },
            'IUniswapV2Factory.sol': {
                content: uniswapInterfaceFactoryContent
            },
            'TransferHelper.sol': {
                content: transferHelperContent
            },
            'IUniswapV2Router01.sol': {
                content: uniswapInterfaceRouter01Content
            },
            'IUniswapV2Router02.sol': {
                content: uniswapInterfaceRouter02Content
            },
            'UniswapV2Library.sol': {
                content: uniswaplibContent
            },
            'SafeMath.sol': {
                content: safemathContent
            },
            'IERC20.sol': {
                content: erc20interfaceContent
            },
            'IWMOAC.sol': {
                content: wmoacinterfaceContent
            },
            'WMOAC.sol': {
                content: wmoacContent
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
    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    console.log(solc.semver());
    routerABI = JSON.stringify(output.contracts['UniswapV2Router02.sol']['UniswapV2Router02'].abi);
    routerBytecode = output.contracts['UniswapV2Router02.sol']['UniswapV2Router02'].evm.bytecode.object;

    //wmoacAddress = "0x2E32C6F7630ca3f06EfAbEaDa1da0Bd28aA18FEA";
    //factoryAddress = "0x91228250705AF76cB0f7EbC128d27d532F36cfF9";
    wmoacAddress = "0x286Bc8d35bb81b004cC0Be7Cdf8432ba8E546955";
    factoryAddress = "0x03D60190c33A6B716FeF08bE1C964182e495F9ff";

    //////////////////////////////////////////////////////////////////////////////
    // deploy contracts
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);
    var routerContract = new web3.eth.Contract(JSON.parse(routerABI));
    var routerInstance = await deployRouter(
        install_account, routerContract, routerBytecode, factoryAddress, wmoacAddress
    );
    console.log(
        "Router deployed at: " + routerInstance.options.address + " " + green_check_mark
    );
}

function deployRouter(install_account, routerContract, contractBytecode, factoryAddr, wmoacAddr) {
    return routerContract.deploy(
        {
            data: '0x' + contractBytecode,
            arguments: [factoryAddr, wmoacAddr]
        }
    ).send({
        from: install_account,
        gas: 7000000
    });
}

main();
