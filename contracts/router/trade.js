require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
var web3 = new Web3('http://172.20.0.11:8545');
//var web3 = new Web3('http://127.0.0.1:8545');
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
    console.log("----------------------------");
    token1 = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    token2 = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    token3 = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";

    factoryAddr = "0x91228250705AF76cB0f7EbC128d27d532F36cfF9";
    routerAddr = "0x588d57969F4211596F7808a66EFAcC7bb890C977";

    output = JSON.parse(solc.compile(JSON.stringify(input)));
    pairABI = JSON.stringify(output.contracts['IUniswapV2Pair.sol']['IUniswapV2Pair'].abi);
    factoryABI = JSON.stringify(output.contracts['IUniswapV2Factory.sol']['IUniswapV2Factory'].abi);
    routerABI = JSON.stringify(output.contracts['UniswapV2Router02.sol']['UniswapV2Router02'].abi);
    erc20ABI = JSON.stringify(output.contracts['IERC20.sol']['IERC20'].abi);

    factoryInstance = new web3.eth.Contract(JSON.parse(factoryABI), factoryAddr);
    routerInstance = new web3.eth.Contract(JSON.parse(routerABI), routerAddr);
    token1Instance = new web3.eth.Contract(JSON.parse(erc20ABI), token1);
    token2Instance = new web3.eth.Contract(JSON.parse(erc20ABI), token2);
    token3Instance = new web3.eth.Contract(JSON.parse(erc20ABI), token3);

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
    console.log("reserve1, reserve2:", reserves[0], reserves[1]);
    // router get quote
    amount1 = 2000;
    reserve1 = reserves[0];
    reserve2 = reserves[1];
    quote = await routerInstance.methods.quote(amount1, reserve1, reserve2).call();
    console.log("amount1", amount1, "quote", quote);
    amountOut = await routerInstance.methods.getAmountOut(amount1, reserve1, reserve2).call();
    console.log("amount1", amount1, "out", amountOut);
    console.log("----------------------------");

    // get pair(token2, token3) contract
    pairAddr = await factoryInstance.methods.getPair(token2, token3).call();
    console.log("(token2, token3) pair: " + pairAddr);
    pairContract = new web3.eth.Contract(JSON.parse(pairABI), pairAddr);
    reserves = await pairContract.methods.getReserves().call();
    console.log("reserve2, reserve3:", reserves[0], reserves[1]);
    amount2 = 2000;
    reserve2 = reserves[0];
    reserve3 = reserves[1];
    quote = await routerInstance.methods.quote(amount2, reserve2, reserve3).call();
    console.log("amount2", amount2, "quote", quote);
    amountOut = await routerInstance.methods.getAmountOut(amount2, reserve2, reserve3).call();
    console.log("amount2", amount2, "out", amountOut);
    console.log("----------------------------");

    // unlock users
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
    console.log("----------------------------");

    // query token 1,2,3 for user 1 before trade #1
    result1 = await token1Instance.methods.balanceOf(user1).call();
    result2 = await token2Instance.methods.balanceOf(user1).call();
    result3 = await token3Instance.methods.balanceOf(user1).call();
    console.log("user 1 before => token1:", result1, "token2:", result2, "token3:", result3);

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

    // query token 1 & 2 for user 1
    result1After = await token1Instance.methods.balanceOf(user1).call();
    result2After = await token2Instance.methods.balanceOf(user1).call();
    result3After = await token3Instance.methods.balanceOf(user1).call();
    console.log("user 1 after => token1:", result1After, "token2:", result2After, "token3:", result3After);
    console.log("diff token1:", result1After - result1, "token2:", result2After - result2, "token3:", result3After - result3);

    console.log("----------------------------");
    // query token 1,2,3 for user 1 before trade #2
    result1 = await token1Instance.methods.balanceOf(user1).call();
    result2 = await token2Instance.methods.balanceOf(user1).call();
    result3 = await token3Instance.methods.balanceOf(user1).call();
    console.log("user 1 before => token1:", result1, "token2:", result2, "token3:", result3);

    // user1 trade 100 token 1 for at least 160 token 2
    amountIn = 100;
    amountOutMin =160;
    path = [token1, token2, token3];
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

    // query token 1 & 2 for user 1
    result1After = await token1Instance.methods.balanceOf(user1).call();
    result2After = await token2Instance.methods.balanceOf(user1).call();
    result3After = await token3Instance.methods.balanceOf(user1).call();
    console.log("user 1 => token1:", result1After, "token2:", result2After, "token3:", result3After);
    console.log("diff token1:", result1After - result1, "token2:", result2After - result2, "token3:", result3After - result3);
}

main();
