require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
//var web3 = new Web3('http://172.20.0.11:8545');
var web3 = new Web3('http://127.0.0.1:8545');
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

    console.log(solc.semver());
    //token1 = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    //token2 = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    //factoryAddr = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";
    //routerAddr = "0xcCa8BAA2d1E83A38bdbcF52a9e5BbB530f50493A";
    token1 = "0x67cDfB5FA248Ca7E84840Cf7f5AD4A09Cb2Fb1e7";
    token2 = "0x7C0d5C71A89AaF27b4221a1B0a38070179190729";
    factoryAddr = "0xc373c746AB0D6DD3EE22Ae2299db469C5f89e8D2";
    routerAddr = "0x6274C172f15e0319E1CA2E426A0AE365B62eA64e";

    output = JSON.parse(solc.compile(JSON.stringify(input)));
    pairABI = JSON.stringify(output.contracts['IUniswapV2Pair.sol']['IUniswapV2Pair'].abi);
    factoryABI = JSON.stringify(output.contracts['IUniswapV2Factory.sol']['IUniswapV2Factory'].abi);
    routerABI = JSON.stringify(output.contracts['UniswapV2Router02.sol']['UniswapV2Router02'].abi);
    erc20ABI = JSON.stringify(output.contracts['IERC20.sol']['IERC20'].abi);

    factoryInstance = new web3.eth.Contract(JSON.parse(factoryABI), factoryAddr);
    routerInstance = new web3.eth.Contract(JSON.parse(routerABI), routerAddr);
    token1Instance = new web3.eth.Contract(JSON.parse(erc20ABI), token1);
    token2Instance = new web3.eth.Contract(JSON.parse(erc20ABI), token2);

    //////////////////////////////////////////////////////////////////////////////
    // load pair contract
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    // get pair(token1, token2) contract
    pairAddr = await factoryInstance.methods.getPair(token1, token2).call();
    console.log("(token1, token2) pair: " + pairAddr);
    var pairContract = new web3.eth.Contract(JSON.parse(pairABI), pairAddr);
    var reserves = await pairContract.methods.getReserves().call();
    console.log("reserveA, reserveB:", reserves[0], reserves[1]);

    // router get quote
    amountA = 2000;
    reserveA = reserves[0];
    reserveB = reserves[1];
    quote = await routerInstance.methods.quote(amountA, reserveA, reserveB).call();
    console.log("amountA", amountA, "quote", quote);
    amountOut = await routerInstance.methods.getAmountOut(amountA, reserveA, reserveB).call();
    console.log("amountA", amountA, "out", amountOut);

    // unlock users
    var unlock_forever = 0;
    var password = "123456";
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
    var deadline = block.timestamp + 10000;
    console.log("Current block: "+blockNumber + ", timestamp: " + block.timestamp + ", deadline: " + deadline + "s");

    // query token 1 & 2 for user 1
    result1 = await token1Instance.methods.balanceOf(user1).call();
    result2 = await token2Instance.methods.balanceOf(user1).call();
    console.log("user 1 => token1:", result1, "token2:", result2);

    // user1 trade 100 token 1 for at least 80 token 2
    amountIn = 100;
    amountOutMin = 80;
    path = [token1, token2];
    fromUser = user1;
    result = await routerInstance.methods.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        fromUser,
        deadline
    ).send({
        from: user1,
        gas: 500000
    });
    //console.log(result);

    // query token 1 & 2 for user 1
    result1After = await token1Instance.methods.balanceOf(user1).call();
    result2After = await token2Instance.methods.balanceOf(user1).call();
    console.log("user 1 => token1:", result1After, "token2:", result2After);
    console.log("diff token1:", result1After - result1, "token2:", result2After - result2);
}

main();
