require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Web3 = require('web3');
var web3 = new Web3('http://172.20.1.11:8545');
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
    // Compile wmoac
    //////////////////////////////////////////////////////////////////////////////

    wmoacFile = "wmoac.sol";
    wmoacContent = fs.readFileSync(wmoacFile, 'utf8');

    wmoac2File = "wmoac2.sol";
    wmoac2Content = fs.readFileSync(wmoac2File, 'utf8');


    var input = {
        language: 'Solidity',
        sources: {
            'wmoac.sol': {
                content: wmoacContent
            },
            'wmoac2.sol': {
                content: wmoac2Content
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
    console.log(solc.compile(JSON.stringify(input)));
    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    erc20ABI = JSON.stringify(output.contracts['token.sol']['ERC20'].abi);
    erc20Bytecode = output.contracts['token.sol']['ERC20'].evm.bytecode.object;

    //////////////////////////////////////////////////////////////////////////////
    // deploy contracts
    //////////////////////////////////////////////////////////////////////////////
    var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var unlock_forever = 0;
    var password = "123456";
    web3.eth.personal.unlockAccount(install_account, password, unlock_forever);

    var erc20Contract = new web3.eth.Contract(JSON.parse(erc20ABI));
    var token1 = await deployERC20(install_account, erc20Contract, erc20Bytecode, "Token 1", "tk1");
    var token2 = await deployERC20(install_account, erc20Contract, erc20Bytecode, "Token 2", "tk2");
    console.log("ERC20 token 1 deployed at: " + token1.options.address + " " + green_check_mark);
    console.log("ERC20 token 2 deployed at: " + token2.options.address + " " + green_check_mark);
}

function deployERC20(install_account, erc20Contract, contractBytecode, name, symbol) {
    return erc20Contract.deploy(
        {
            data: '0x' + contractBytecode,
            arguments: [name, symbol]
        }
    ).send({
        from: install_account,
        gas: 9000000
    });
}

main();
