const Web3 = require('web3');
const web3 = new Web3("wss://localhost:8546");

web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
// web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
// web3.setProvider(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/26d793d15bd34844a9d047730086477d'));

// const eth = web3.eth;
// eth.getBlockNumber().then(console.log);

newBlockHeaders();
pendingTransactions();

function newBlockHeaders(){
  var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
      if (!error){
          console.log(result);
      }
  }).on("data", function(transaction){
          console.log(`transaction:${transaction}`);
      });
}

function pendingTransactions(){
  var subscription = web3.eth.subscribe('pendingTransactions', function(error, result){
        if (!error){
            console.log(`result:${result}`);
        }
    }).on("data", function(transaction){
        console.log(`transaction:${transaction}`);
    });
}
