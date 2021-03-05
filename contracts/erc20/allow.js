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

// contract dirrectory
var contract_dir = "uniswap_contracts";


async function main() {
    //////////////////////////////////////////////////////////////////////////////
    // Compile erc20
    //////////////////////////////////////////////////////////////////////////////

    erc20Solfile = "ERC20.sol";
    erc20ContractContent = fs.readFileSync(erc20Solfile, 'utf8');

    erc20interfaceFile = "IERC20.sol";
    erc20interfaceContent = fs.readFileSync(erc20interfaceFile, 'utf8');

    safemathFile = "SafeMath.sol";
    safemathContent = fs.readFileSync(safemathFile, 'utf8');

    contextFile = "Context.sol";
    contextContent = fs.readFileSync(contextFile, 'utf8');

    var input = {
        language: 'Solidity',
        sources: {
            'token.sol': {
                content: erc20ContractContent
            },
            'IERC20.sol': {
                content: erc20interfaceContent
            },
            'SafeMath.sol': {
                content: safemathContent
            },
            'Context.sol': {
                content: contextContent
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
    erc20ABI = JSON.stringify(output.contracts['token.sol']['ERC20'].abi);
    erc20Bytecode = output.contracts['token.sol']['ERC20'].evm.bytecode.object;

    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    var user1 = "0xf34c3a04099a76dda80517373b21409391540b82";
    var user2 = "0x903ee4f9753b3717aa6a295b02095aa0c94036d0";
    var user3 = "0xf084d898a6329d0d9159ddccca0380d651ee1c17";
    var user4 = "0x3563e38cc436bd6835da191228115fe7869a382c";
    web3.eth.personal.unlockAccount(user1, password, unlock_forever);
    web3.eth.personal.unlockAccount(user2, password, unlock_forever);
    web3.eth.personal.unlockAccount(user3, password, unlock_forever);
    web3.eth.personal.unlockAccount(user4, password, unlock_forever);

    // wait 5 seconds for unlock
    await new Promise(resolve => setTimeout(resolve, 5000));

    approveAmount = 10000000;
    routerContractAddress = "0x588d57969F4211596F7808a66EFAcC7bb890C977";
    var token1Address = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    var token2Address = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    var token3Address = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";

    var token1 = new web3.eth.Contract(JSON.parse(erc20ABI), token1Address);
    var token2 = new web3.eth.Contract(JSON.parse(erc20ABI), token2Address);
    var token3 = new web3.eth.Contract(JSON.parse(erc20ABI), token3Address);
    // user 1 approve router for token 1 and 2
    result = await token1.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas:200000
    });
    result = await token2.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas:200000
    });
    result = await token3.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas:200000
    });
    // user 2 approve router for token 1 and 2
    result = await token1.methods.approve(routerContractAddress, approveAmount).send({
        from: user2,
        gas:200000
        });
    result = await token2.methods.approve(routerContractAddress, approveAmount).send({
        from: user2,
        gas:200000
    });
    result = await token3.methods.approve(routerContractAddress, approveAmount).send({
        from: user2,
        gas:200000
    });
    // user 3 approve router for token 1 and 2
    result = await token1.methods.approve(routerContractAddress, approveAmount).send({
        from: user3,
        gas:200000
        });
    result = await token2.methods.approve(routerContractAddress, approveAmount).send({
        from: user3,
        gas:200000
    });
    result = await token3.methods.approve(routerContractAddress, approveAmount).send({
        from: user3,
        gas:200000
    });
    // user 4 approve router for token 1 and 2
    result = await token1.methods.approve(routerContractAddress, approveAmount).send({
        from: user4,
        gas:200000
        });
    result = await token2.methods.approve(routerContractAddress, approveAmount).send({
        from: user4,
        gas:200000
    });
    result = await token3.methods.approve(routerContractAddress, approveAmount).send({
        from: user4,
        gas:200000
    });

    // verify the allowance for token 1 and 2
    result1 = await token1.methods.allowance(user1, routerContractAddress).call();
    result2 = await token1.methods.allowance(user2, routerContractAddress).call();
    result3 = await token1.methods.allowance(user3, routerContractAddress).call();
    result4 = await token1.methods.allowance(user4, routerContractAddress).call();

    result5 = await token2.methods.allowance(user1, routerContractAddress).call();
    result6 = await token2.methods.allowance(user2, routerContractAddress).call();
    result7 = await token2.methods.allowance(user3, routerContractAddress).call();
    result8 = await token2.methods.allowance(user4, routerContractAddress).call();

    result9 = await token3.methods.allowance(user1, routerContractAddress).call();
    resulta = await token3.methods.allowance(user2, routerContractAddress).call();
    resultb = await token3.methods.allowance(user3, routerContractAddress).call();
    resultc = await token3.methods.allowance(user4, routerContractAddress).call();

    console.log(
        "Allowance result: \n",
        result1, result2, result3, result4, "\n",
        result5, result6, result7, result8, "\n",
        result9, resulta, resultb, resultc
    );
}

main();
