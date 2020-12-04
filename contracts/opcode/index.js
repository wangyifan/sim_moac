var Web3 = require('web3');
var web3 = new Web3('http://172.20.1.11:8545');
var solc = require("solc");
var fs = require("fs");
web3.eth.getAccounts(console.log);

//////////////////////////////////////////////////////////////////////////////
// Compile erc20
//////////////////////////////////////////////////////////////////////////////

erc20Solfile = "UniswapV2ERC20.sol";
erc20ContractContent = fs.readFileSync(erc20Solfile, 'utf8');
erc20interfaceFile = "IUniswapV2ERC20.sol";
erc20interfaceContent = fs.readFileSync(erc20interfaceFile, 'utf8');
safemathFile = "SafeMath.sol";
safemathContent = fs.readFileSync(safemathFile, 'utf8');

var input = {
  language: 'Solidity',
  sources: {
      'UniswapV2ERC20.sol': {
          content: erc20ContractContent
      },
      'IUniswapV2ERC20.sol': {
          content: erc20interfaceContent
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
var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(JSON.stringify(output.contracts['UniswapV2ERC20.sol']['UniswapV2ERC20'].abi));
console.log(output.contracts['UniswapV2ERC20.sol']['UniswapV2ERC20'].evm.bytecode.object);

//////////////////////////////////////////////////////////////////////////////
// Compile uniswap factory and pair
//////////////////////////////////////////////////////////////////////////////
uniswapFactoryInterfaceFile = "IUniswapV2Factory.sol";
uniswapFactoryInterfaceContent = fs.readFileSync(uniswapFactoryInterfaceFile, 'utf8');
uniswapERC20InterfaceFile = "IUniswapV2ERC20.sol";
uniswapERC20InterfaceContent = fs.readFileSync(uniswapERC20InterfaceFile, 'utf8');
uniswapPairInterfaceFile = "IUniswapV2Pair.sol";
uniswapPairInterfaceContent = fs.readFileSync(uniswapPairInterfaceFile, 'utf8');
uniswapCalleeInterfaceFile = "IUniswapV2Callee.sol";
uniswapCalleeInterfaceContent = fs.readFileSync(uniswapCalleeInterfaceFile, 'utf8');
erc20InterfaceFile = "IERC20.sol";
erc20InterfaceContent = fs.readFileSync(erc20InterfaceFile, 'utf8');
uniswapFactoryFile = "UniswapV2Factory.sol";
uniswapFactoryContent = fs.readFileSync(uniswapFactoryFile, 'utf8');
uniswapPairFile = "UniswapV2Pair.sol";
uniswapPairContent = fs.readFileSync(uniswapPairFile, 'utf8');
uniswapERC20File = "UniswapV2ERC20.sol";
uniswapERC20Content = fs.readFileSync(uniswapERC20File, 'utf8');
mathFile = "Math.sol";
mathContent = fs.readFileSync(mathFile, 'utf8');
uq112File = "UQ112x112.sol";
uq112Content = fs.readFileSync(uq112File, 'utf8');

input = {
  language: 'Solidity',
  sources: {
      'IUniswapV2Factory.sol': {
          content: uniswapFactoryInterfaceContent
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
      'UniswapV2Factory.sol' : {
          content: uniswapFactoryContent
      },
      'UniswapV2Pair.sol': {
          content: uniswapPairContent
      },
      'UniswapV2ERC20.sol': {
          content: uniswapERC20Content
      },
      'Math.sol': {
          content: mathContent
      },
      'UQ112x112.sol': {
          content: uq112Content
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

output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(JSON.stringify(output.contracts['UniswapV2Factory.sol']['UniswapV2Factory'].abi));
console.log(output.contracts['UniswapV2Factory.sol']['UniswapV2Factory'].evm.bytecode.object);

//////////////////////////////////////////////////////////////////////////////
// deploy contracts
//////////////////////////////////////////////////////////////////////////////
var install_account = "0xa35add395b804c3faacf7c7829638e42ffa1d051";

// For deploy uniswap factory v2
function deployUniswapFactoryV2ContractPromise(){
    return new Promise((resolve, reject) => {
        deployTransaction = {
            from: install_account,
            data: '0x' + "",
            gas: "9000000"
        };

        Contract.new(
            deployTransaction,
            (e, contract) => {
                if (e) {
                    reject(e);
                }

                if (contract && typeof contract.address !== 'undefined') {
                    resolve(contract);
                }
            });
    });
}