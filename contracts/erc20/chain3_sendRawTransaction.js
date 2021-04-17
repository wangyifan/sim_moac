require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

var Chain3 = require('chain3');
var hostport = "http://"+ "172.20.0.11" + ":" + "8545";
var chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(hostport));
var user = "0xa35add395b804c3faacf7c7829638e42ffa1d051";
var privateKey = "0x393873d6bbc61b9d83ba923e08375b7bf8210a12bed4ea2016d96021e9378cc9";
//var chainid = chain3.mc.getChainId();
var chainid = 95125;
var nonce = chain3.mc.getTransactionCount(user);;
console.log("nonce = " + nonce);

var rawTx = {
      from: user,
      nonce: chain3.intToHex(1),
      gasPrice: chain3.intToHex(2000000000),
      gasLimit: chain3.intToHex(2000),
      to: '0xf1f5b7a35dff6400af7ab3ea54e4e637059ef909',
      value: chain3.intToHex(chain3.toSha(1, 'mc')),
      data: '0x00',
      chainId: chainid
};

var cmd1 = chain3.signTransaction(rawTx, privateKey);
chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
    if (!err){
	console.log("Succeed!: ", hash);
	return hash;
    }else{
	console.log("Chain3 error:", err.message);
	return err.message;
    }
});
