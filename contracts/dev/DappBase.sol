pragma solidity ^0.4.17;

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
    
    struct EnterRecords {
        address[] userAddr;
        uint[] amount;
        uint[] time;
        uint[] buyTime;
    }
    
    RedeemMapping internal redeem;
    address[] public curNodeList;//
    mapping(bytes32=>Task) task;
    mapping(bytes32=>address[]) nodeVoters;
    address internal owner;
    EnterRecords internal enterRecords;
    uint public enterPos;
    
	function DappBase() public payable {
		owner = msg.sender;
	}
	
	function getCurNodeList() public view returns (address[] nodeList) {
        
        return curNodeList;
    }
    
    function getEnterRecords(address userAddr) public view returns (uint[] enterAmt, uint[] entertime) {
        uint i;
        uint j = 0;
        
        for (i = 0; i < enterPos; i++) {
            if (enterRecords.userAddr[i] == userAddr) {
                j++;
            }
        }
        
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        j = 0;
        for (i = 0; i < enterPos; i++) {
            if (enterRecords.userAddr[i] == userAddr) {
                amounts[j] = enterRecords.amount[i];
                times[j] = enterRecords.time[i];
                j++;
            }
        }
        return (amounts, times);
    }
	
	function getRedeemMapping(address userAddr, uint pos) public view returns (address[] redeemingAddr, uint[] redeemingAmt, uint[] redeemingtime) {
        uint j = 0;
        uint k = 0;
        
        if (userAddr != address(0)) {
            for (k = pos; k < redeem.userAddr.length; k++) {
                if (redeem.userAddr[k] == userAddr) {
                    j++;
                }
            }
        } else {
            j += redeem.userAddr.length - pos;
        }
        address[] memory addrs = new address[](j);
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        j = 0;
        for (k = pos; k < redeem.userAddr.length; k++) {
            if (userAddr != address(0)) {
                if (redeem.userAddr[k] == userAddr) {
                    amounts[j] = redeem.userAmount[k];
                    times[j] = redeem.time[k];
                    j++;
                }
            } else {
                addrs[j] = redeem.userAddr[k];
                amounts[j] = redeem.userAmount[k];
                times[j] = redeem.time[k];
                j++;
            }
        }
        return (addrs, amounts, times);
    }
	
	function redeemFromMicroChain() public payable {
        redeem.userAddr.push(msg.sender);
        redeem.userAmount.push(msg.value);
        redeem.time.push(now);
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
    
    function postFlush(uint pos, address[] tosend, uint[] amount, uint[] times) public {
        require(have(curNodeList, msg.sender));
        require(tosend.length == amount.length);
        require(pos == enterPos);
        
        bytes32 hash = sha3(pos, tosend, amount, times);
        if( task[hash].distDone) return;
        if(!have(task[hash].voters, msg.sender)) {
            task[hash].voters.push(msg.sender);
            if(task[hash].voters.length > curNodeList.length/2 ) {
                //distribute
                task[hash].distDone = true;
                for(uint i=0; i<tosend.length; i++ ) {
                    enterRecords.userAddr.push(tosend[i]);
                    enterRecords.amount.push(amount[i]);
                    enterRecords.time.push(now);
                    enterRecords.buyTime.push(times[i]);
                    tosend[i].transfer(amount[i]);
                }
                enterPos += tosend.length;
            }
        }
    }
}
