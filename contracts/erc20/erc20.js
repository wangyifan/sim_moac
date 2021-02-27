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

    //////////////////////////////////////////////////////////////////////////////
    // deploy contracts
    //////////////////////////////////////////////////////////////////////////////
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

    // wait 5 seonds for unlock to take effect
    await new Promise(resolve => setTimeout(resolve, 5000));

    // deploy erc20 contracts
    var erc20Contract = new web3.eth.Contract(JSON.parse(erc20ABI));
    var token1 = await deployERC20(install_account, erc20Contract, erc20Bytecode, "Token 1", "tk1");
    var token2 = await deployERC20(install_account, erc20Contract, erc20Bytecode, "Token 2", "tk2");
    console.log("ERC20 token 1 deployed at: " + token1.options.address + " " + green_check_mark);
    console.log("ERC20 token 2 deployed at: " + token2.options.address + " " + green_check_mark);

    // distribute token 1
    amount = 12345678;
    result = await token1.methods.mint(user1, amount).send({
        from: user1,
        gas: 100000
    });
    result = await token1.methods.mint(user2, amount).send({
        from: user2,
        gas: 100000
    });
    result = await token1.methods.mint(user3, amount).send({
        from: user3,
        gas: 100000
    });
    result = await token1.methods.mint(user4, amount).send({
        from: user4,
        gas: 100000
    });

    result = await token1.methods.balanceOf(user1).call();
    console.log(user1 + " token1 : " + result);
    result = await token1.methods.balanceOf(user2).call();
    console.log(user2 + " token1 : " + result);
    result = await token1.methods.balanceOf(user3).call();
    console.log(user3 + " token1 : " + result);
    result = await token1.methods.balanceOf(user4).call();
    console.log(user4 + " token1 : " + result);

    // distribute token 2
    result = await token2.methods.mint(user1, amount).send({
        from: user1,
        gas: 100000
    });
    result = await token2.methods.mint(user2, amount).send({
        from: user2,
        gas: 100000
    });
    result = await token2.methods.mint(user3, amount).send({
        from: user3,
        gas: 100000
    });
    result = await token2.methods.mint(user4, amount).send({
        from: user4,
        gas: 100000
    });

    result = await token2.methods.balanceOf(user1).call();
    console.log(user1 + " token2 : " + result);
    result = await token2.methods.balanceOf(user2).call();
    console.log(user2 + " token2 : " + result);
    result = await token2.methods.balanceOf(user3).call();
    console.log(user3 + " token2 : " + result);
    result = await token2.methods.balanceOf(user4).call();
    console.log(user4 + " token2 : " + result);
}

function deployERC20(install_account, erc20Contract, contractBytecode, name, symbol) {
    return erc20Contract.deploy(
        {
            data: '0x' + contractBytecode,
            arguments: [name, symbol]
        }
    ).send({
        from: install_account,
        gas: 3000000
    });
}

main();
