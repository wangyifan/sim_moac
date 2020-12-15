require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
var web3 = new Web3('http://172.20.0.11:8545');
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

    wmoacABI = JSON.stringify(output.contracts['WMOAC.sol']['WMOAC'].abi);
    wmoacBytecode = output.contracts['WMOAC.sol']['WMOAC'].evm.bytecode.object;

    //////////////////////////////////////////////////////////////////////////////
    // deploy contracts
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    var wmoacContract = new web3.eth.Contract(JSON.parse(wmoacABI));
    var wmoacInstance = await deployWMOAC(
        install_account, wmoacContract, wmoacBytecode
    );
    console.log(
        "WMOAC deployed at: " + wmoacInstance.options.address + " " + green_check_mark
    );
}

function deployWMOAC(install_account, wmoacContract, contractBytecode) {
    return wmoacContract.deploy(
        {
            data: '0x' + contractBytecode,
            arguments: []
        }
    ).send({
        from: install_account,
        gas: 9000000
    });
}

main();
