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
    routerAddress = "0xcCa8BAA2d1E83A38bdbcF52a9e5BbB530f50493A";
    var token1Address = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    var token2Address = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";


    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    // unlock all users
    var user1 = "0xf34c3a04099a76dda80517373b21409391540b82";
    var user2 = "0x903ee4f9753b3717aa6a295b02095aa0c94036d0";
    var user3 = "0xf084d898a6329d0d9159ddccca0380d651ee1c17";
    var user4 = "0x3563e38cc436bd6835da191228115fe7869a382c";
    web3.eth.personal.unlockAccount(user1, password, unlock_forever);
    web3.eth.personal.unlockAccount(user2, password, unlock_forever);
    web3.eth.personal.unlockAccount(user3, password, unlock_forever);
    web3.eth.personal.unlockAccount(user4, password, unlock_forever);

    var blockNumber = await web3.eth.getBlockNumber();
    var block = await web3.eth.getBlock(blockNumber);
    var deadline = block.timestamp + 100;
    console.log("Current block: "+blockNumber + ", timestamp: " + block.timestamp + ", deadline: " + deadline + "s");

    web3.eth.handleRevert = true;
    var routerContract = new web3.eth.Contract(JSON.parse(routerABI), routerAddress);

    try {
        routerContract.handleRevert = true;
        result = await routerContract.methods.addLiquidity(
            token2Address,
            token1Address,
            10000,
            10000,
            1000,
            1000,
            user1,
            deadline
        ).send({
            from: user1,
            gas: 3000000
        });
        console.log("Adding liquidity...");
        console.log(result);
    } catch (err) {
        console.log("web3.eth.handleRevert =", web3.eth.handleRevert);
        console.error(err);
        console.log("err.message =",err.message);
        console.log("err.reason =", JSON.stringify(err));
    }
}

main();