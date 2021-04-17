require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
var Transaction = require('ethereumjs-tx').Transaction;
var Common = require('ethereumjs-common').default;

var Web3 = require('web3');
var Chain3 = require('chain3');
var hostport = "http://"+ "172.20.0.11" + ":" + "8545";
var web3 = new Web3();
var chain3 = new Chain3();
web3.setProvider(new web3.providers.HttpProvider(hostport));
chain3.setProvider(new chain3.providers.HttpProvider(hostport));
//var web3 = new Web3('http://127.0.0.1:18545');
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

async function testSendrawtransaction() {
    //////////////////////////////////////////
    //////////////////////////////////////////
    ///compile erc20
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
    var token1Address = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    var token1 = new web3.eth.Contract(JSON.parse(erc20ABI), token1Address);

    ///////////////////////////////////////
    ///////////////////////////////////////
    // test sendRawtransaction with web3
    var routerContractAddress = "0x588d57969F4211596F7808a66EFAcC7bb890C977";
    var chainid = await web3.eth.getChainId();
    var to = "0xf34c3a04099a76dda80517373b21409391540b82";
    var from = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
    var fromPrivatekey = new Buffer.from('393873d6bbc61b9d83ba923e08375b7bf8210a12bed4ea2016d96021e9378cc9', 'hex');
    var nonce = await web3.eth.getTransactionCount(from);
    //var data = token1.methods.approve(routerContractAddress, approveAmount).encodeABI();
    var data = "0x00";
    var amount = '3';
    var estimatedGas = "0x123456";
    var gasPrice = '0x09184e72a000';
    console.log("nonce: " + "0x"+ nonce.toString(16) + ", estimated gas: " + estimatedGas + ", data: " + data);
    var rawTx = {
        to: to,
        nonce: "0x"+ nonce.toString(16),
        value: "0x"+ parseInt(web3.utils.toWei(amount, 'ether')).toString(16),
        gasPrice: gasPrice,
        gasLimit: estimatedGas,
        data: data
    };

    const customChainParams = { name: 'moac', chainId: chainid, networkId: chainid };
    const customChainCommon = Common.forCustomChain('mainnet', customChainParams, 'byzantium');
    var tx = new Transaction(
        rawTx, {common: customChainCommon}
    );
    console.log("rawtx: "+ JSON.stringify(rawTx));
    console.log("tx: " + JSON.stringify(tx));
    tx.sign(fromPrivatekey);
    console.log("web3 signed tx: " + JSON.stringify(tx));
    var serializedTx = tx.serialize();
    console.log("web3 serialized tx: " + serializedTx.toString('hex'));
    result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(result);
}

async function testEstimatedGas() {
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

    approveAmount = 10;
    routerContractAddress = "0x588d57969F4211596F7808a66EFAcC7bb890C977";
    var token1Address = "0x3bD86aB1AaD5BeDcDF8Cd6f72791B91aD06d7B5a";
    var token2Address = "0x67013bCe15A69Ca00a64B3c5E74fb052907c786b";
    var token3Address = "0xd2861C34e7720A6E4D22ac1Fa77422f01add13E8";
    var token1 = new web3.eth.Contract(JSON.parse(erc20ABI), token1Address);
    var token2 = new web3.eth.Contract(JSON.parse(erc20ABI), token2Address);
    var token3 = new web3.eth.Contract(JSON.parse(erc20ABI), token3Address);

    // user 1 approve router for token 1, 2 and 3
    estimatedGas = await token1.methods.approve(routerContractAddress, approveAmount).estimateGas({gas: 100000, from: user1});
    gas = parseInt(parseInt(estimatedGas) * 110/100);
    result = await token1.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas: gas
    });
    console.log("estimatedGas " + estimatedGas + " gas " + result.gasUsed);

    estimatedGas = await token2.methods.approve(routerContractAddress, approveAmount).estimateGas({gas: 100000, from: user1});
    gas = parseInt(parseInt(estimatedGas) * 110/100);
    result = await token2.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas: gas
    });
    console.log("estimatedGas " + estimatedGas + " gas " + result.gasUsed);

    estimatedGas = await token3.methods.approve(routerContractAddress, approveAmount).estimateGas({gas: 100000, from: user1});
    gas = parseInt(parseInt(estimatedGas) * 110/100);
    result = await token3.methods.approve(routerContractAddress, approveAmount).send({
        from: user1,
        gas: gas
    });
    console.log("estimatedGas " + estimatedGas + " gas used " + result.gasUsed);
}

async function main() {
    testSendrawtransaction();
    //testEstimatedGas();
}

main();
