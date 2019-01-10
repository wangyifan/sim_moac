pragma solidity ^0.4.13;

//MicroChain definition for application.
contract DappBase {
	struct RedeemMapping {
        address[] userAddr;
        uint[] userAmount;
        uint[] time;
    }
    
    struct Task{
        bytes32 hash;
        address[] voters;
        bool distDone;
    }
    
    mapping(uint => RedeemMapping) internal redeem;
    address[] public curNodeList;//
    mapping(bytes32=>Task) task;
    mapping(bytes32=>address[]) nodeVoters;
    address internal owner;
    
	function DappBase() public payable {
		owner = msg.sender;
	}
	
	function getCurNodeList() public view returns (address[] nodeList) {
        
        return curNodeList;
    }
	
	function getRedeemMapping(address userAddr, uint start, uint end) public view returns (address[] redeemingAddr, uint[] redeemingAmt, uint[] redeemingtime) {
        uint i = 0;
        uint j = 0;
        uint k = 0;
        
        for (i = start; i <= end; i++) {
            if (userAddr != address(0)) {
                for (k = 0; k < redeem[i].userAddr.length; k++) {
                    if (redeem[i].userAddr[k] == userAddr) {
                        j++;
                    }
                }
            } else {
                j += redeem[i].userAddr.length;
            }
        }
        address[] memory addrs = new address[](j);
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        j = 0;
        for (i = start; i <= end; i++) {
            for (k = 0; k < redeem[i].userAddr.length; k++) {
                if (userAddr != address(0)) {
                    if (redeem[i].userAddr[k] == userAddr) {
                        amounts[j] = redeem[i].userAmount[k];
                        times[j] = redeem[i].time[k];
                        j++;
                    }
                } else {
                    addrs[j] = redeem[i].userAddr[k];
                    amounts[j] = redeem[i].userAmount[k];
                    times[j] = redeem[i].time[k];
                    j++;
                }
            }
        }
        return (addrs, amounts, times);
    }
	
	function redeemFromMicroChain() public payable {
        redeem[block.number].userAddr.push(msg.sender);
        redeem[block.number].userAmount.push(msg.value);
        redeem[block.number].time.push(now);
    }
    
    function have(address[] addrs, address addr) public view returns (bool) {
        uint i;
        for (i = 0; i < addrs.length; i++) {
            if(addrs[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
    function updateNodeList(address[] newlist) public {
        //if owner, can directly update
        if(msg.sender==owner) {
            curNodeList = newlist;
        }
        //count votes
        bytes32 hash = sha3(newlist);
        bytes32 oldhash = sha3(curNodeList);
        if( hash == oldhash) return;
        
        bool res = have(nodeVoters[hash], msg.sender);
        if (!res) {
            nodeVoters[hash].push(msg.sender);
            if(nodeVoters[hash].length > newlist.length/2) {
                curNodeList = newlist;
            }
        }
        
        return;
    }
    
    function postFlush(bytes32 flushhash, address[] tosend, uint[] amount) public {
        require(have(curNodeList, msg.sender));
        require(tosend.length == amount.length);
        
        bytes32 hash = sha3(flushhash, tosend, amount);
        if( task[hash].distDone) return;
        if(!have(task[hash].voters, msg.sender)) {
            task[hash].voters.push(msg.sender);
            if(task[hash].voters.length > curNodeList.length/2 ) {
                //distribute
                task[hash].distDone = true;
                for(uint i=0; i<tosend.length; i++ ) {
                    tosend[i].transfer(amount[i]);
                }
            }
        }
    }
}