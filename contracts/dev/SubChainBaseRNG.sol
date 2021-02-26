pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

import "./SubChainProtocolBase.sol";

/*
======= SubChainBaseRNG.sol:SCSRelay =======
Function signatures:
219dc4a0: notifySCS(address,uint256)

======= SubChainBaseRNG.sol:SubChainBase =======
Function signatures:
7a813833: AUTO_RETIRE()
d4f79bd5: AUTO_RETIRE_COUNT()
15e9977e: BALANCE()
312e014b: BackupUpToDate(uint256)
f21df012: DEFLATOR_VALUE()
bff92d70: MAX_DELETE_NUM()
e3bbb4f1: MAX_GAS_PRICE()
950f7879: MONITOR_JOIN_FEE()
f2faa2a6: MONITOR_MIN_FEE()
dc393c09: NODE_INIT_PERFORMANCE()
dcd338ca: UploadRedeemData(address[],uint256[])
dc82c54f: VnodeProtocolBaseAddr()
a2f09dfa: addFund()
6f7e15da: addSyncNode(address,string)
0ac168a1: blockReward()
6bbded70: buyMintToken()
c66da997: checkProposalStatus(bytes32)
43d726d6: close()
30e7f8ef: consensusFlag()
a7fc1161: contractNeedFund()
1463ef07: createProposal(uint256,bytes32[],uint256[],uint256[],uint256[],address,uint256)
76164fb6: curFlushIndex()
6b35d367: currentRefundGas(address)
e9e150d0: dappRedeemPos()
fcac00bc: flushInRound()
2da03719: funcCode()
42cbb15c: getBlockNumber()
b19932c0: getEnteringAmount(address,uint256)
c20b1246: getEstFlushBlock(uint256)
c067247c: getFlushInfo()
ab3c7d87: getFlushStatus()
21a1b495: getMonitorInfo()
c7f758a8: getProposal(uint256)
b74c3eff: getRedeemRecords(address)
50859fd9: getSCSRole(address)
3c1f16aa: getVnodeInfo()
5f5ffef0: getVssBase()
8640c8b1: getholdingPool()
d736b382: initialFlushInRound()
d0fab885: isMemberValid(address)
e5df8425: joinCntMax()
d12ff2eb: joinCntNow()
9d3979a1: lastFlushBlk()
b8598896: matchSelTarget(address,uint8,uint8)
07289245: maxFlushInRound()
03e3c9ac: maxMember()
5fd652db: max_redeemdata_num()
2b114a7c: minMember()
44a58781: monitors(uint256)
6da49b83: nodeCount()
208f2a31: nodeList(uint256)
a9555e6c: nodePerformance(address)
26009deb: nodeToReleaseCount()
3b082706: nodesToDispel(uint256)
a94f7a70: nodesToJoin(uint256)
cae56d58: nodesToRelease(uint256)
57365df2: nodesWatching(address)
83d6f697: penaltyBond()
0d314546: pendingFlushIndex()
793ebd89: per_recharge_num()
a53dae59: per_redeemdata_num()
0be6075a: per_upload_redeemdata_num()
b8697fe2: priceOneGInMOAC()
eba308f8: proposalExpiration()
db22ccad: proposalHashApprovedLast()
ca3b852f: proposalHashInProgress()
32ed5b12: proposals(bytes32)
8ce74426: protocol()
cbe5b2a4: randIndex(uint256)
634eaea6: rebuildFromLastFlushPoint()
9eb34e43: recharge_cycle()
be93f1b3: registerAdd(uint256)
6f8c54b5: registerAsBackup(address,uint8,bytes32,bytes32,bytes32)
4d13deae: registerAsMonitor(address,string)
89873927: registerAsSCS(address,uint8,bytes32,bytes32,bytes32)
69f3576f: registerClose()
5defc56c: registerOpen()
df4b780d: removeMonitorInfo(address)
110afc0f: removeSyncNode(uint256)
ca5e56aa: requestEnterAndRedeemAction(bytes32)
cc819ad0: requestProposalAction(uint256,bytes32)
30be5944: requestRelease(uint256,uint256)
301b4887: requestReleaseImmediate(uint256,uint256)
d826f88f: reset()
2ad0f79b: scsBeneficiary(address)
d7c3dc5f: selTarget()
40caae06: setOwner()
03d05923: setVssBase(address)
c063d987: syncNodes(uint256)
c4474a59: syncReward()
9b09723e: totalBond()
b55845e7: totalExchange()
fae67d40: totalOperation()
f9326cf5: txNumInFlush()
46d63676: txReward()
aa7e2986: updatePerRechargeNum(uint256)
689b00ed: updatePerRedeemNum(uint256)
3a46492a: updatePerUploadRedeemNum(uint256)
6d9817eb: updateRechargeCycle(uint256)
b062a927: viaReward()
517549a0: voteOnProposal(uint256,bytes32,bool)
11f79f7c: vssSlash(address)
a5824de1: vssbase()
f3fef3a3: withdraw(address,uint256)

======= SubChainBaseRNG.sol:VssBase =======
Function signatures:
e4c1de98: activateVSS(address)
de79b856: deactivateVSS(address)
eefb4227: registerVSS(address,bytes32)
f06dc92d: unregisterVSS(address)

======= SubChainProtocolBase.sol:SubChainProtocolBase =======
Function signatures:
99f874d8: PENDING_BLOCK_DELAY()
f9eae020: WITHDRAW_BLOCK_DELAY()
1aa887ca: approvalAddresses(address)
41205305: approvalAmounts(address)
6220fb1d: approveBond(address,uint256,uint8,bytes32,bytes32)
cb7f8266: bondMin()
64f3ef46: forfeitBond(address,uint256)
de42f13c: getSelectionTarget(uint256,uint256)
e17095a4: getSelectionTargetByCount(uint256)
ce9d9bd7: isPerforming(address)
bd8d4bd8: protocolType()
4420e486: register(address)
202cc5e1: releaseFromSubchain(address,uint256)
9adea807: releaseRequest(address,address)
76a95e88: scsApprovalList(address)
aab31933: scsArray(uint256)
6e62adcb: scsCount()
c9a856a3: scsList(address)
365bfb9e: setSubchainActiveBlock()
b8a167e6: setSubchainExpireBlock(uint256)
c3a919d0: subChainExpireBlock(address)
67bd927e: subChainLastActiveBlock(address)
f21e6f7a: subChainProtocol()
3ccfd60b: withdraw()
380e687a: withdrawRequest()

======= SubChainProtocolBase.sol:SysContract =======
Function signatures:
c8d0d29a: delayedSend(uint256,address,uint256,bool)
*/

contract SCSRelay {
    // 0-registeropen
    // 1-registerclose
    // 2-createproposal
    // 3-disputeproposal
    // 4-approveproposal
    // 5-registeradd
    function notifySCS(address cnt, uint msgtype) public returns (bool success);
}

contract VssBase {
    function registerVSS(address sender, bytes32 publickey) public;
    function unregisterVSS(address sender) public;
    function activateVSS(address sender) public;
    function deactivateVSS(address sender) public;
}

contract SubChainBase {
    enum ProposalFlag {noState, pending, disputed, approved, rejected, expired, pendingAccept}
    enum ProposalCheckStatus {undecided, approval, expired}
    enum ConsensusStatus {initStage, workingStage, failure}
    enum SCSRelayStatus {
      registerOpen,
      registerClose,
      createProposal,
      disputeProposal,
      approveProposal,
      registerAdd,
      regAsMonitor,
      regAsBackup,
      updateLastFlushBlk,
      distributeProposal,
      reset,
      uploadRedeemData,
      requestEnterAndRedeem,
      requestReleaseImmediateAndVSSGroupConfig,
      vssEnabled,
      vssGroupConfig,
      distributeProposalAndVSSGroupConfig
    }
    enum SubChainStatus {open, pending, close}

    struct Proposal {
        address proposedBy;
        bytes32 lastApproved;
        bytes32 hash;
        uint start;
        uint end;
        //bytes newState;
        uint[] distributionAmount;
        uint flag; // one of ProposalFlag
        uint startingBlock;
        uint[] voters; //voters index
        uint votecount;
        uint[] badActors;
        address viaNodeAddress;
        uint preRedeemNum;
        address[] redeemAddr;
        uint[] redeemAmt;
        address[] minerAddr;
        uint distributeFlag;
        address[] redeemAgreeList;
    }

    struct VRS {
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    struct SyncNode {
        address nodeId;
        string link;
    }

    struct holdings {
        address[] userAddr;
        uint[] amount;
        uint[] time;
    }

    struct RedeemRecords {
        uint[] redeemAmount;
        uint[] redeemtime;
    }

    struct VnodeInfo {
        address protocol;
        uint[] members;
        uint[] rewards;    //0:blockReward; 1:txReward; 2:viaReward
        uint proposalExpiration;
        address VnodeProtocolBaseAddr;
        uint penaltyBond;
        uint subchainstatus;
        address owner;
        uint256 BALANCE;
        uint[] redeems;

        address[] nodeList;
        address[] nodesToJoin;
    }

     struct MonitorInfo {
        address from; // address as id
        uint256 bond; // value
        string link;  // ip:prort
    }

    address public protocol;
    uint public minMember;
    uint public maxMember;
    uint public selTarget;
    uint public consensusFlag; // 0: init stage 1: working stage 2: failure
    uint public flushInRound;
    uint public initialFlushInRound;

    bytes32 public proposalHashInProgress;
    bytes32 public proposalHashApprovedLast;  //index: 7

    uint public curFlushIndex;
    uint public  pendingFlushIndex;

    bytes public funcCode;
    bytes internal state;

    uint public lastFlushBlk;

    address internal owner;

    //nodes list is updated at each successful flush
    uint public nodeCount;
    address[] public nodeList;    //index: 0f

    uint8[2] public randIndex;
    mapping(address => uint ) public nodePerformance;
    mapping(bytes32 => Proposal) public proposals;  //index: 12
    mapping(address => uint) public currentRefundGas;

    uint internal registerFlag;

    uint public proposalExpiration = 24;
    uint public penaltyBond = 10 ** 18; // 1 Moac penalty
    mapping(address=>address) public scsBeneficiary;
    uint public blockReward = 5 * 10 ** 14;    //index: 18
    uint public txReward  = 1 * 10 ** 11;
    uint public viaReward = 1 * 10 ** 16;

    uint public nodeToReleaseCount;
    uint[5] public nodesToRelease;  //nodes wish to withdraw, only allow 5 to release at a time
    mapping(address=>VRS) internal nodesToReleaseVRS;
    uint[] public nodesToDispel;

    address[] public nodesToJoin;  //nodes to be joined
    uint public joinCntMax;
    uint public joinCntNow;
    uint public MONITOR_JOIN_FEE = 1 * 10 ** 16;
    mapping(address=>uint) public nodesWatching;  //nodes watching

    SyncNode[] public syncNodes;
    uint indexAutoRetire;

    uint constant VIANODECNT = 100;
    SCSRelay internal constant SCS_RELAY = SCSRelay(0x000000000000000000000000000000000000000d);
    uint public constant NODE_INIT_PERFORMANCE = 5;
    uint public constant AUTO_RETIRE_COUNT = 2;
    bool public constant AUTO_RETIRE = false;
    address public VnodeProtocolBaseAddr;
    uint public MONITOR_MIN_FEE = 1 * 10 ** 12;
    uint public syncReward = 1 * 10 ** 11;
    uint public MAX_GAS_PRICE = 20 * 10 ** 9;

    uint public DEFLATOR_VALUE = 80; // in 1/millionth: in a year, exp appreciation is 12x

    uint internal subchainstatus;
    uint256 public BALANCE = 0;    //index: 30

    //temp holdingplace whenentering microchain
    holdings internal holdingPool;
    uint public per_recharge_num = 250;
    uint public recharge_cycle = 6;

    // inidicator of fund needed
    uint public contractNeedFund;

    mapping(address=>RedeemRecords) internal records;
    MonitorInfo[] public monitors;

    uint public MAX_DELETE_NUM = 5;
    uint public dappRedeemPos = 0;
    uint public per_upload_redeemdata_num = 160;//167
    uint public per_redeemdata_num = 130;//140
    uint public max_redeemdata_num = 500;

    uint public maxFlushInRound = 500;
    uint public txNumInFlush = 100;

    uint256 public priceOneGInMOAC;
    uint public totalExchange;
    uint public totalOperation;
    uint public totalBond;
    address public vssbase;

    //events
    event ReportStatus(string message);
    event TransferAmount(address addr, uint amount);

    //constructor
    function SubChainBase(address proto, address vnodeProtocolBaseAddr, uint min, uint max, uint thousandth, uint flushRound, uint256 tokensupply, uint256 exchangerate, address vssbaseAddr) public {
        require(min == 1 || min == 3 || min == 5 || min == 7);
        require(max == 11 || max == 21 || max == 31 || max == 51 || max == 99);
        require(flushRound >= 40  && flushRound <= 500);

        flushInRound = flushRound;
        initialFlushInRound = flushRound;
        VnodeProtocolBaseAddr = vnodeProtocolBaseAddr;
        SubChainProtocolBase protocnt = SubChainProtocolBase(proto);
        selTarget = protocnt.getSelectionTarget(thousandth, min);
        protocnt.setSubchainActiveBlock();

        minMember = min;
        maxMember = max;
        protocol = proto; //address
        consensusFlag = uint(ConsensusStatus.initStage);
        owner = msg.sender;

        protocnt.setSubchainExpireBlock(flushInRound*5);
        lastFlushBlk = 2 ** 256 - 1;

        BALANCE = tokensupply * 10 ** 18;
        priceOneGInMOAC = exchangerate;

        randIndex[0] = uint8(0);
        randIndex[1] = uint8(1);
        indexAutoRetire = 0;
        subchainstatus = uint(SubChainStatus.open);

        vssbase = vssbaseAddr;
    }

    function() public payable {
        //only allow protocol send
        require(protocol == msg.sender);
    }

    function setOwner() public {
        if (owner == address(0)) {
            owner = msg.sender;
        }
    }

    function setVssBase(address newVssBase) public {
        require(owner == msg.sender);
        vssbase = newVssBase;
    }

    function getVssBase() public view returns (address) {
      return vssbase;
    }

    function getFlushStatus() public view returns (bool) {
        uint blk = lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration;
        return (block.number <= blk);
    }

    function updatePerRechargeNum(uint num) public {
        require(owner == msg.sender);

        per_recharge_num = num;
    }

    function updateRechargeCycle(uint num) public {
        require(owner == msg.sender);

        recharge_cycle = num;
    }

    function updatePerUploadRedeemNum(uint num) public {
        require(owner == msg.sender);

        per_upload_redeemdata_num = num;
    }

    function updatePerRedeemNum(uint num) public {
        require(owner == msg.sender);

        per_redeemdata_num = num;
    }

    function isMemberValid(address addr) public view returns (bool) {
        return nodePerformance[addr] > 0;
    }

    function vssSlash(address addr) public {
        require(msg.sender == vssbase);
        if (nodePerformance[addr] > 0) {
            nodePerformance[addr] = 0;
        }

        // if it is not valid, deactivate in vss
        if (!isMemberValid(addr)) {
            VssBase vssbaseContract = VssBase(vssbase);
            vssbaseContract.deactivateVSS(addr);
        }
    }

    function getVnodeInfo() public view returns (VnodeInfo) {
        VnodeInfo vnodeinfo;

        vnodeinfo.protocol = protocol;
        uint[] memory members = new uint[](2);
        members[0] = minMember;
        members[1] = maxMember;
        vnodeinfo.members = members;
        uint[] memory rewards = new uint[](3);
        rewards[0] = blockReward;    //index: 18
        rewards[1] = txReward;
        rewards[2] = viaReward;
        vnodeinfo.rewards = rewards;
        vnodeinfo.proposalExpiration = proposalExpiration;
        vnodeinfo.VnodeProtocolBaseAddr = VnodeProtocolBaseAddr;
        vnodeinfo.penaltyBond = penaltyBond;
        vnodeinfo.subchainstatus = subchainstatus;
        vnodeinfo.owner = owner;
        vnodeinfo.BALANCE = BALANCE;
        uint[] memory redeems = new uint[](4);
        redeems[0] = dappRedeemPos;
        redeems[1] = per_upload_redeemdata_num;
        redeems[2] = per_redeemdata_num;
        redeems[3] = max_redeemdata_num;
        vnodeinfo.redeems = redeems;

        vnodeinfo.nodeList = nodeList;
        vnodeinfo.nodesToJoin = nodesToJoin;

        return vnodeinfo;
    }

    function getProposal(uint types) public view returns (Proposal) {
        if (types == 1) {
            return proposals[proposalHashInProgress];
        } else if (types == 2) {
            return proposals[proposalHashApprovedLast];
        }
    }

    function getSCSRole(address scs) public view returns (uint) {
        uint i = 0;

        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i] == scs) {
                return 1;
            }
        }

        if (nodesWatching[scs] >= 10**9) {
            return 2;
        }

        for (i = 0; i < nodesToJoin.length; i++) {
            if (nodesToJoin[i] == scs) {
                return 3;
            }
        }

        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (protocnt.isPerforming(scs)) {
            if (matchSelTarget(scs, randIndex[0], randIndex[1])) {
                return 4;
            }
        }

        return 0;
    }

    function registerAsMonitor(address monitor, string link) public payable {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.value >= MONITOR_MIN_FEE);
        require(nodesWatching[monitor] == 0);
        require(monitor != address(0));
        require(getSCSRole(monitor) == 4 || getSCSRole(monitor) == 0);
        nodesWatching[monitor] = msg.value;
        totalBond += msg.value;

        // Add MonitorInfo
        monitors.push(MonitorInfo(monitor, msg.value, link));

        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.regAsMonitor));
    }

    function getMonitorInfo() public view returns (address[], string[]) {
        uint cnt = monitors.length;
        address[] memory addrlist = new address[](cnt);
        string[] memory strlist = new string[](cnt);
        uint i = 0;
        for (i = 0; i < cnt; i++) {
            addrlist[i] = monitors[i].from;
            strlist[i] = monitors[i].link;
        }

        return (addrlist, strlist);
    }

    function removeMonitorInfo(address monitor) public {
        uint i = 0;
        uint cnt = monitors.length;
        for (i = cnt; i > 0; i--) {
            if (monitors[i-1].from == monitor) {
                // withdraw
                monitor.transfer(monitors[i-1].bond);
                totalBond -= monitors[i-1].bond;

                // delete
                monitors[i-1] = monitors[cnt-1];
                delete monitors[cnt-1];
                monitors.length--;
                nodesWatching[monitor] = 0;
                delete nodesWatching[monitor];
            }
        }
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsSCS(address beneficiary, uint8 v, bytes32 r, bytes32 s, bytes32 publickey) public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(getSCSRole(msg.sender) == 4);
        if (registerFlag != 1) {
            return false;
        }
        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(msg.sender)) {
            return false;
        }

        if (!matchSelTarget(msg.sender, randIndex[0], randIndex[1])) {
            return false;
        }

        // if reach max, reject
        if (nodeCount > maxMember) {
            return false;
        }

        //check if node already registered
        for (uint i=0; i < nodeCount; i++) {
            if (nodeList[i] == msg.sender) {
                return false;
            }
        }

        //make sure msg.sender approve bond deduction
        if (!protocnt.approveBond(msg.sender, penaltyBond, v, r, s)) {
            return false;
        }

        nodeList.push(msg.sender);
        nodeCount++;
        nodePerformance[msg.sender] = NODE_INIT_PERFORMANCE;

        // put the scs in vss group and activate
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.registerVSS(msg.sender, publickey);
        vssbaseContract.activateVSS(msg.sender);

        if (beneficiary == address(0)) {
            scsBeneficiary[msg.sender] = msg.sender;
        }
        else {
            scsBeneficiary[msg.sender] = beneficiary;
        }

        return true;
    }

    //v,r,s are the signature of msg hash(scsaddress+subchainAddr)
    function registerAsBackup(address beneficiary, uint8 v, bytes32 r, bytes32 s, bytes32 publickey) public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(getSCSRole(msg.sender) == 4);
        if (registerFlag != 2) {
            return false;
        }

        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(msg.sender)) {
            return false;
        }

        if (!matchSelTarget(msg.sender, randIndex[0], randIndex[1])) {
            return false;
        }

        //if reach max, reject
        if (joinCntNow >= joinCntMax) {
            return false;
        }

        uint i = 0;
        //check if node already registered
        for (i = 0; i < nodeCount; i++) {
            if (nodeList[i] == msg.sender) {
                return false;
            }
        }
        for (i = 0; i < nodesToJoin.length; i++) {
            if (nodesToJoin[i] == msg.sender) {
                return false;
            }
        }

        //make sure msg.sender approve bond deduction
        if (!protocnt.approveBond(msg.sender, penaltyBond, v, r, s)) {
            return false;
        }

        nodesToJoin.push(msg.sender);
        joinCntNow++;
        //set to performance to 0 since backup node has no block synced yet.
        nodePerformance[msg.sender] = 0; //NODE_INIT_PERFORMANCE;

        // put the scs in vss group but not yet activate it
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.registerVSS(msg.sender, publickey);

        if (beneficiary == address(0)) {
            scsBeneficiary[msg.sender] = msg.sender;
        }
        else {
            scsBeneficiary[msg.sender] = beneficiary;
        }

        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.regAsBackup));
        return true;
    }

    function BackupUpToDate(uint index) public {
        require( registerFlag == 2 );
        require( nodesToJoin[index] == msg.sender);
        nodePerformance[msg.sender] = NODE_INIT_PERFORMANCE;
    }

    //user can explicitly release
    function requestRelease(uint senderType, uint index) public returns (bool) {
        //only in nodeList and scsBeneficiary can call this function
        if (senderType == 1) {
            if (nodeList[index] != msg.sender) {
                return false;
            }
        } else if (senderType == 2) {
            if (scsBeneficiary[nodeList[index]] != msg.sender) {
                return false;
            }
        } else {
            return false;
        }
        //check if already requested
        for (uint i = 0; i < nodeToReleaseCount; i++) {
            if (nodesToRelease[i] == index) {
                return false;
            }
        }

        nodesToRelease[nodeToReleaseCount] = index;
        nodeToReleaseCount++;

        return true;
    }

    //user can explicitly release
    function requestReleaseImmediate(uint senderType, uint index) public returns (bool) {
        //only in nodeList and scsBeneficiary can call this function
        if (senderType == 1) {
            if (nodeList[index] != msg.sender) {
                return false;
            }
        } else if (senderType == 2) {
            if (scsBeneficiary[nodeList[index]] != msg.sender) {
                return false;
            }
        } else {
            return false;
        }

        if (block.number <= lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration) {
            return false;
        }

        address cur = nodeList[index];
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        protocnt.releaseFromSubchain(
            cur,
            penaltyBond
        );

        // remove from vssbase
        VssBase vssbaseContract = VssBase(vssbase);
        vssbaseContract.unregisterVSS(cur);

        nodeCount--;
        nodeList[index] = nodeList[nodeCount];
        delete nodeList[nodeCount];
        nodeList.length--;
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.requestReleaseImmediateAndVSSGroupConfig));

        return true;
    }

    function registerOpen() public {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        registerFlag = 1;

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerOpen));
    }

    function registerClose() public returns (bool) {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        registerFlag = 0;
        VssBase vssbaseContract = VssBase(vssbase);

        if (nodeCount < minMember) {
            SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
            //release already enrolled scs
            for (uint i = nodeCount; i > 0; i--) {
                //release fund
                address cur = nodeList[i - 1];
                protocnt.releaseFromSubchain(
                    cur,
                    penaltyBond
                );
                vssbaseContract.unregisterVSS(cur);
                delete nodeList[i - 1];
            }

            nodeCount = 0;

            return false;
        }

        //now we can start to work now
        lastFlushBlk = block.number;
        curFlushIndex = 0;

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerClose));
        return true;
    }

    function registerAdd(uint nodeToAdd) public {
        require(subchainstatus == uint(SubChainStatus.open));
        require(msg.sender == owner);
        require(joinCntNow + nodeCount < maxMember);

        registerFlag = 2;
        joinCntMax = maxMember - joinCntNow - nodeCount;
        joinCntNow = nodesToJoin.length;
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        selTarget = protocnt.getSelectionTargetByCount(nodeToAdd);

        //call precompiled code to invoke action on v-node
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.registerAdd));
    }

    function getFlushInfo() public view returns (uint) {
        for (uint i=1; i <= nodeCount; i++) {
            uint blk = lastFlushBlk + flushInRound + i * 2 * proposalExpiration;
            if (blk > block.number) {
                return blk - block.number;
            }
        }
        return 0;
    }

    function getholdingPool() public constant returns (address[]) {
        return holdingPool.userAddr;
    }

    function getEnteringAmount(address userAddr, uint holdingPoolPos) public constant returns (address[] enteringAddr, uint[] enteringAmt, uint[] enteringtime, uint[] rechargeParam) {
        uint i;
        uint j = 0;

        if (userAddr != address(0)) {
            for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
                if (holdingPool.userAddr[i] == userAddr) {
                    j++;
                }
            }
        } else {
            j = holdingPool.userAddr.length - holdingPoolPos;
        }

        address[] memory addrs = new address[](j);
        uint[] memory amounts = new uint[](j);
        uint[] memory times = new uint[](j);
        uint[] memory params = new uint[](2);
        j = 0;
        for (i = holdingPoolPos; i < holdingPool.userAddr.length; i++) {
            if (userAddr != address(0)) {
                if (holdingPool.userAddr[i] == userAddr) {
                    amounts[j] = holdingPool.amount[i];
                    times[j] = holdingPool.time[i];
                    j++;
                }
            } else {
                addrs[j] = holdingPool.userAddr[i];
                amounts[j] = holdingPool.amount[i];
                times[j] = holdingPool.time[i];
                j++;
            }
        }
        params[0] = per_recharge_num;
        params[1] = recharge_cycle;
        return (addrs, amounts, times, params);
    }

    function getRedeemRecords(address userAddr) public view returns (RedeemRecords) {
        return records[userAddr];
    }

    //|----------|---------|---------|xxx|yyy|zzz|
    function getEstFlushBlock(uint index) public view returns (uint) {
        uint blk = lastFlushBlk + flushInRound;
        //each flusher has [0, 2*expire] to finish
        if (index >= curFlushIndex) {
            blk += (index - curFlushIndex) * 2 * proposalExpiration;
        }
        else {
            blk += (index + nodeCount - curFlushIndex) * 2 * proposalExpiration;
        }

        return blk;
    }

    // create proposal
    // bytes32 hash;
    // bytes newState;
    function createProposal(
        uint indexInlist,
        bytes32[] hashlist,
        uint[] blocknum,
        uint[] distAmount,
        uint[] badactors,
        address viaNodeAddress,
        uint preRedeemNum
    )
        public
        returns (bool)
    {
        uint gasinit = msg.gas;
        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(block.number >= getEstFlushBlock(indexInlist) &&
                block.number < (getEstFlushBlock(indexInlist)+ 2*proposalExpiration));
        require( distAmount.length == nodeCount);
        require( badactors.length < nodeCount/2);
        require( tx.gasprice <= MAX_GAS_PRICE );
        require( contractNeedFund < totalOperation );

        //if already a hash proposal in progress, check if it is set to expire
        if (
            proposals[proposalHashInProgress].flag == uint(ProposalFlag.pending)
        ) {
            //for some reason, lastone is not updated
            //set to expire
            proposals[proposalHashInProgress].flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            if (nodePerformance[proposals[proposalHashInProgress].proposedBy] > 0) {
                nodePerformance[proposals[proposalHashInProgress].proposedBy]--;
            }
        }

        //proposal must based on last approved hash
        if (hashlist[0] != proposalHashApprovedLast) {
            return false;
        }

        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        bytes32 curhash = hashlist[1];
        //check if proposal is already in
        if (proposals[curhash].flag > uint(ProposalFlag.noState)) {
            return false;
        }

        //store it into storage.
        proposals[curhash].proposedBy = msg.sender;
        proposals[curhash].lastApproved = proposalHashApprovedLast;
        proposals[curhash].hash = curhash;
        proposals[curhash].start = blocknum[0];
        proposals[curhash].end = blocknum[1];
        uint i=0;
        for (i=0; i < nodeCount; i++) {
            proposals[curhash].distributionAmount.push(distAmount[i]);
            proposals[curhash].minerAddr.push(nodeList[i]);
        }
        proposals[curhash].flag = uint(ProposalFlag.pending);
        proposals[curhash].startingBlock = getEstFlushBlock(indexInlist);
        //add into voter list
        proposals[curhash].voters.push(indexInlist);
        proposals[curhash].votecount++;

        proposals[curhash].redeemAgreeList.push(msg.sender);

        for (i=0; i < badactors.length; i++) {
            proposals[curhash].badActors.push(badactors[i]);
        }

        //set via nodeelse
        proposals[curhash].viaNodeAddress = viaNodeAddress;

        // ErcMapping ss;
        proposals[curhash].preRedeemNum = preRedeemNum;
        proposals[curhash].distributeFlag = 0;

        //notify v-node
        if (preRedeemNum == 0) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.createProposal));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.uploadRedeemData));
        }

        proposalHashInProgress = curhash;
        pendingFlushIndex = indexInlist;
        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486 ) * tx.gasprice;

        return true;
    }

    function UploadRedeemData(
        address[] redeemAddr,
        uint[] redeemAmt
    )
        public
        returns (bool)
    {
        Proposal storage prop = proposals[proposalHashInProgress];
        uint gasinit = msg.gas;
        require(msg.sender == prop.proposedBy);
        require( redeemAddr.length + prop.redeemAddr.length <= prop.preRedeemNum);
        require( tx.gasprice <= MAX_GAS_PRICE );

        for (uint i=0; i < redeemAddr.length; i++) {
            prop.redeemAddr.push(redeemAddr[i]);
            prop.redeemAmt.push(redeemAmt[i]);
        }

        //notify v-node
        if (prop.redeemAddr.length == prop.preRedeemNum) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.createProposal));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.uploadRedeemData));
        }

        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486 ) * tx.gasprice;
        return true;
    }

    //vote on proposal
    function voteOnProposal(uint indexInlist, bytes32 hash, bool redeem) public returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];

        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require( tx.gasprice <= MAX_GAS_PRICE );
        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        //check if proposal is in proper flag state
        if (prop.flag != uint(ProposalFlag.pending)) {
            return false;
        }
        //check if dispute proposal in proper range [0, expire]
        if ((prop.startingBlock + 2*proposalExpiration) < block.number) {
            return false;
        }

        //traverse back to make sure not double vote
        for (uint i=0; i < prop.votecount; i++) {
            if (prop.voters[i] == indexInlist) {
                return false;
            }
        }

        if (redeem) {
            prop.redeemAgreeList.push(msg.sender);
        }

        //add into voter list
        prop.voters.push(indexInlist);
        prop.votecount++;

        currentRefundGas[msg.sender] += (gasinit - msg.gas + 21486) * tx.gasprice;

        return true;
    }

    function checkProposalStatus(bytes32 hash ) public view returns (uint) {
        if ((proposals[hash].startingBlock + 2*proposalExpiration) < block.number) {
            //expired
            return uint(ProposalCheckStatus.expired);
        }

        //if reaches 50% more agreement
        if ((proposals[hash].votecount * 2) > nodeCount) {
            //more than 50% approval
            return uint(ProposalCheckStatus.approval);
        }

        //undecided
        return uint(ProposalCheckStatus.undecided);
    }

    function revenueDistribution(bytes32 hash ) private {
        Proposal storage prop = proposals[hash];
        address cur;
         //check if contract has enough fund
        uint totalamount = 0;

        totalamount += viaReward;

        for (uint i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            totalamount += currentRefundGas[cur];
            totalamount += prop.distributionAmount[i];
        }
         //if not enough amount, halt proposal
        if( totalamount > totalOperation ) {
            //set global flag
            contractNeedFund += totalamount;
            return ;
        }

         //doing actual distribution
        prop.viaNodeAddress.transfer(viaReward);
        totalOperation -= viaReward;
        TransferAmount(prop.viaNodeAddress, viaReward);

        uint amts;
        for ( i = 0; i < prop.minerAddr.length; i++) {
            cur = prop.minerAddr[i];
            uint targetGas = currentRefundGas[cur];
            currentRefundGas[cur] = 0;
            cur.transfer(targetGas);
            totalOperation -= targetGas;
            TransferAmount(cur, targetGas);
            targetGas = prop.distributionAmount[i];
            scsBeneficiary[cur].transfer(targetGas);
            amts += targetGas;
            totalOperation -= targetGas;
            TransferAmount(scsBeneficiary[cur], targetGas);
        }

        uint txNum = (amts - blockReward * (prop.end - prop.start + 1)) / txReward;
        if (txNum <= txNumInFlush) {
            flushInRound += 40;
            if (flushInRound > maxFlushInRound) {
                flushInRound = maxFlushInRound;
            }
        } else {
            flushInRound = flushInRound / 2;
            if (flushInRound < initialFlushInRound) {
                flushInRound = initialFlushInRound;
            }
        }
    }

    //request proposal approval
    function requestProposalAction(uint indexInlist, bytes32 hash) public returns (bool) {
        uint gasinit = msg.gas;
        Proposal storage prop = proposals[hash];

        require(indexInlist < nodeCount && msg.sender == nodeList[indexInlist]);
        require(prop.flag == uint(ProposalFlag.pending));
        require( tx.gasprice <= MAX_GAS_PRICE );

        //check if sender is part of SCS list
        if (!isSCSValid(msg.sender)) {
            return false;
        }

        //make sure the proposal to be approved is the correct proposal in progress
        if (proposalHashInProgress != hash) {
             return false;
        }

        //check if ready to accept
        uint chk = checkProposalStatus(hash);
        if (chk == uint(ProposalCheckStatus.undecided)) {
            return false;
        }
        else if (chk == uint(ProposalCheckStatus.expired)) {
            prop.flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            address by = prop.proposedBy;
            if (nodePerformance[by] > 0) {
                nodePerformance[by]--;
            }

            return false;
        }

        //punish bad actors
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        uint i = 0;
        for (i=0; i<prop.badActors.length; i++) {
            uint badguy = prop.badActors[i];
            nodePerformance[nodeList[badguy]] = 0;
        }

        //punish nodePerformance is 0
        if (nodesToDispel.length < MAX_DELETE_NUM) {
            uint num = MAX_DELETE_NUM - nodesToDispel.length;
            for (i=0; i<nodeCount; i++) {
                if (num == 0) {
                    break;
                }
                if (nodePerformance[nodeList[i]] == 0) {
                    nodesToDispel.push(i);
                    protocnt.forfeitBond(nodeList[i], penaltyBond);
                    totalOperation += penaltyBond;
                    num--;
                }
            }
        }

        //for correct voter, increase performance
        for (i = 0; i < prop.votecount; i++) {
            address vt = nodeList[prop.voters[i]];
            if (nodePerformance[vt] < NODE_INIT_PERFORMANCE) {
                nodePerformance[vt]++;
            }
        }

        bool nodesChanged = false;
        //remove bad nodes
        nodesChanged = applyRemoveNodes(0);

        //remove node to release
        nodesChanged = nodesChanged || applyRemoveNodes(1);

        //update randIndex
        bytes32 randseed = sha256(hash, block.number);
        randIndex[0] = uint8(randseed[0]) / 8;
        randIndex[1] = uint8(randseed[1]) / 8;

        //if some nodes want to join in
        if (registerFlag == 2) {
            nodesChanged = nodesChanged || applyJoinNodes();
        }

        //if need toauto retire nodes
        if (AUTO_RETIRE) {
            for (i=0; i<AUTO_RETIRE_COUNT; i++) {
                if (indexAutoRetire >= nodeCount) {
                    indexAutoRetire = 0;
                }
                requestRelease(1, indexAutoRetire);
                indexAutoRetire ++ ;
            }
        }

        //notify v-node
        if (prop.redeemAddr.length == 0) {
            revenueDistribution(hash);
            flushEnd(hash, nodesChanged);
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.approveProposal));
        }

        //make protocol pool to know subchain is active
        protocnt.setSubchainActiveBlock();

        //adjust reward
        adjustReward();

        //update flag
        prop.distributeFlag = 1;
        //refund current caller
        totalOperation -= (gasinit - msg.gas + 15000) * tx.gasprice;
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);

        //refund all to owner
        if (subchainstatus == uint(SubChainStatus.close)) {
            owner.transfer(this.balance - totalExchange/priceOneGInMOAC - totalBond);
            totalOperation = 0;
        }
        return true;
    }

    function flushEnd(bytes32 hash, bool nodesChanged) private {
        Proposal storage prop = proposals[hash];

        //setflag
        prop.distributeFlag = 2;
        //mark as approved
        prop.flag = uint(ProposalFlag.approved);
        //reset flag
        proposalHashInProgress = 0x0;
        proposalHashApprovedLast = hash;
        lastFlushBlk = block.number;

        curFlushIndex = pendingFlushIndex + 1;
        if (curFlushIndex > nodeCount) {
            curFlushIndex = 0;
        }

        if (subchainstatus == uint(SubChainStatus.pending)) {
            withdrawal();
        }

        if (nodesChanged == true) {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.distributeProposalAndVSSGroupConfig));
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.distributeProposal));
        }
    }

    function requestEnterAndRedeemAction(bytes32 hash) public returns (bool) {
        uint gasinit = msg.gas;
        //any one can request
        Proposal storage prop = proposals[hash];
        require(BALANCE != 0);
        require(prop.distributeFlag == 1);
        require(prop.flag == uint(ProposalFlag.pending));

        uint chk = checkProposalStatus(hash);
        if (chk == uint(ProposalCheckStatus.undecided)) {
            return false;
        }
        else if (chk == uint(ProposalCheckStatus.expired)) {
            prop.flag = uint(ProposalFlag.expired);  //expired.
            //reduce proposer's performance
            address by = prop.proposedBy;
            if (nodePerformance[by] > 0) {
                nodePerformance[by]--;
            }

            return false;
        }

        //redeem tokens
        uint i;
        bool res = true;
        if (prop.redeemAgreeList.length > nodeCount/2 && prop.preRedeemNum != 0) {
            uint len = prop.preRedeemNum;
            if (len > per_redeemdata_num) {
                len = per_redeemdata_num;
            }

            uint pos = prop.redeemAddr.length - prop.preRedeemNum;
            address addr;
            uint amt;
            for (i = pos; i < pos + len; i++) {
                addr =  prop.redeemAddr[i];
                amt = prop.redeemAmt[i];
                totalExchange -= amt;
                addr.transfer(amt / priceOneGInMOAC);
                records[addr].redeemAmount.push(amt);
                records[addr].redeemtime.push(now);
            }
            prop.preRedeemNum -= len;
            dappRedeemPos += len;
            res = false;
        }
        if (res) {
            revenueDistribution(hash);
            flushEnd(hash, false);
        } else {
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.requestEnterAndRedeem));
        }

        totalOperation -= (gasinit - msg.gas + 15000) * tx.gasprice;
        msg.sender.transfer((gasinit - msg.gas + 15000) * tx.gasprice);

        if (subchainstatus == uint(SubChainStatus.close)) {
            owner.transfer(this.balance - totalExchange/priceOneGInMOAC - totalBond);
            totalOperation = 0;
        }
        return true;
    }

    function adjustReward() private {
        blockReward = blockReward - blockReward * DEFLATOR_VALUE / 10 ** 6;
        txReward = txReward - txReward * DEFLATOR_VALUE / 10 ** 6;
        viaReward = viaReward - viaReward * DEFLATOR_VALUE / 10 ** 6;
        syncReward = syncReward - syncReward * DEFLATOR_VALUE / 10 ** 6;
    }

    //to increase reward if deflator is too much
    function increaseReward(uint percent) private {
        require(owner == msg.sender);
        blockReward = blockReward + blockReward * percent / 100;
        txReward = txReward - txReward * percent / 100;
        viaReward = viaReward - viaReward * percent / 100;
        syncReward = syncReward - syncReward * percent / 100;
    }

    function addFund() public payable {
        require(owner == msg.sender);
        totalOperation += msg.value;
        if( totalOperation > contractNeedFund ) {
            contractNeedFund = 0;
            uint blk = lastFlushBlk + flushInRound + nodeCount * 2 * proposalExpiration;

            if (block.number >= blk) {
                lastFlushBlk = block.number;
                SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.updateLastFlushBlk));
            }
        }
    }

    function withdraw(address recv, uint amount) public {
        require(owner == msg.sender);
        //withdraw to address
        recv.transfer(amount);
        totalOperation -= amount;
    }

    function withdrawal() private {
        subchainstatus = uint(SubChainStatus.close);
        registerFlag = 0;
        VssBase vssbaseContract = VssBase(vssbase);

        //release fund
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        //release already enrolled scs
        for (uint i = nodeCount; i > 0; i--) {
            //release fund
            address cur = nodeList[i-1];
            protocnt.releaseFromSubchain(
                cur,
                penaltyBond
            );
            vssbaseContract.unregisterVSS(cur);
            delete nodeList[i-1];
        }
        nodeCount = 0;

        for (i = joinCntNow; i > 0; i--) {
            cur = nodesToJoin[i-1];
            protocnt.releaseFromSubchain(
                cur,
                penaltyBond
            );
            vssbaseContract.unregisterVSS(cur);
            delete nodesToJoin[i-1];
            nodesToJoin.length --;
        }
        joinCntNow = 0;
        joinCntMax = 0;
    }

    function close() public {
        require(owner == msg.sender);

        subchainstatus = uint(SubChainStatus.pending);

        if (proposalHashInProgress == 0x0) {
            lastFlushBlk = block.number - flushInRound;
            SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.updateLastFlushBlk));
        }
    }

    function reset() public {
        require(owner == msg.sender);
        lastFlushBlk = block.number;
        flushInRound = 60;
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.reset));
    }

    function addSyncNode(address id, string link) public {
        require(owner == msg.sender);
        syncNodes.push(SyncNode(id, link));
    }

    function removeSyncNode(uint index) public {
        require(owner == msg.sender && syncNodes.length > index);
        syncNodes[index] = syncNodes[syncNodes.length - 1];
        delete syncNodes[syncNodes.length - 1];
        syncNodes.length--;
    }

    function isSCSValid(address addr) private view returns (bool) {
        if (!isMemberValid(addr)) {
            return false;
        }

        //check if valid registered in protocol pool
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        if (!protocnt.isPerforming(addr)) {
            return false;
        }
        return true;
    }

    function applyJoinNodes() private returns (bool) {
        uint i = 0;
        bool nodesChanged = false;
        VssBase vssbaseContract = VssBase(vssbase);
        for (i = joinCntNow; i > 0; i--) {
            if( nodePerformance[nodesToJoin[i-1]] == NODE_INIT_PERFORMANCE) {
                nodeList.push(nodesToJoin[i-1]);
                nodeCount++;
                nodesChanged = true;

                // activate the node with vss
                vssbaseContract.activateVSS(nodesToJoin[i-1]);

                //delete node
                nodesToJoin[i-1] = nodesToJoin[nodesToJoin.length-1];
                delete nodesToJoin[nodesToJoin.length-1];
                nodesToJoin.length --;
            }
        }

        joinCntNow = nodesToJoin.length;
        if( joinCntNow == 0 ) {
            joinCntMax = 0;
            registerFlag = 0;
        }

        return nodesChanged;
    }

    // reuse this code for remove bad node or other volunteerly leaving node
    // nodetype 0: bad node, 1: volunteer leaving node
    function applyRemoveNodes(uint nodetype) private returns (bool) {
        SubChainProtocolBase protocnt = SubChainProtocolBase(protocol);
        VssBase vssbaseContract = VssBase(vssbase);
        bool nodesChanged = false;

        uint count = nodesToDispel.length;
        if (nodetype == 1) {
            count = nodeToReleaseCount;
        }

        if (count == 0) {
            return nodesChanged;
        }

        // all nodes set 0 at initial, set node to be removed as 1.
        uint[] memory nodeMark = new uint[](nodeCount);
        uint idx = 0;
        uint i = 0;
        for (i = 0; i < count; i++) {
            if (nodetype == 0) {
                //bad ones
                nodeMark[nodesToDispel[i]] = 1;
            }
            else {
                idx = nodesToRelease[i];
                //volunteer leaving, only were not marked as bad ones
                if (nodeMark[idx] == 0) {
                    nodeMark[idx] = 1;
                    //release fund
                    address cur = nodeList[idx];
                    protocnt.releaseFromSubchain(
                        cur,
                        penaltyBond
                    );
                }
            }
        }

        //adjust to update nodeList
        for (i = nodeCount; i > 0; i--) {
            if (nodeMark[i-1] == 1) {
                //swap with last element
                // remove node from list
                nodeCount--;
                vssbaseContract.unregisterVSS(nodeList[i-1]);
                nodeList[i-1] = nodeList[nodeCount];
                delete nodeList[nodeCount];
                nodeList.length--;
                nodesChanged = true;
            }
        }

        //clear nodesToDispel and nodesToRelease array
        if (nodetype == 0) {
            //clear bad ones
            nodesToDispel.length = 0 ;
        } else {
            //clear release count
            nodeToReleaseCount = 0;
        }

        return nodesChanged;
    }

    // ATO new
    function rebuildFromLastFlushPoint() public {
        require(msg.sender == owner);
        //notifyscs
        //set flushindex
        curFlushIndex = 0;
    }


    function getindexByte(address a, uint8 randIndex1, uint8 randIndex2) private  pure returns (uint b) {
        uint8 first = uint8(uint(a) / (2 ** (4 * (39 - uint(randIndex1)))) * 2 ** 4);
        uint8 second = uint8(uint8(uint(a) / (2 ** (4 * (39 - uint(randIndex2)))) * 2 ** 4) / 2 ** 4);    // &15
        return uint(byte(first + second));
    }

    function matchSelTarget(address addr, uint8 index1, uint8 index2) public view returns (bool) {
        // check if selTargetdist matches.
        uint addr0 = getindexByte(addr, index1, index2);
        uint cont0 = getindexByte(address(this), index1, index2);

        if (selTarget == 255) {
            return true;
        }

        if (addr0 >= cont0) {
            if ((addr0 - cont0) <= selTarget) {
                return true;
            }
            else {
                if (cont0 - selTarget < 0) {
                    if ((addr0 - cont0) >= 256 - selTarget) {
                        //lower half round to top,  addr0 -256 >= cont0 -selTarget
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }
        else {
            //addr0 < cont0
            if ((cont0 - addr0) <= selTarget) {
                return true;
            }
            else {
                if (cont0 + selTarget >= 256) {
                    if ((cont0 - addr0) >= 256 - selTarget) {
                        //top half round to bottom,   addr0 +256  <= (selTarget+cont0)
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }

        return true;
    }

    function buyMintToken() public payable returns (bool){
        uint256 token = msg.value * priceOneGInMOAC;
        uint256 balance = BALANCE - totalExchange;
        uint256 refund = 0;
        if(token > balance){
            refund = ( token - balance) / priceOneGInMOAC;
            msg.sender.transfer( refund );
            token = balance;
        }
        totalExchange += token;
        holdingPool.userAddr.push(msg.sender);
        holdingPool.amount.push(token);
        holdingPool.time.push(now);
        return true;
    }

    function getBlockNumber() public view returns (int) {
        return int(block.number);
    }

    function placeholder() public view returns (string) {
      return "60806040526018601655670de0b6b3a76400006017556601c6bf5263400060195564174876e800601a55662386f26fc10000601b55662386f26fc1000060275564e8d4a51000602c5564174876e800602d556404a817c800602e556050602f55600060315560fa60355560066036556005603a556000603b5560a0603c556082603d556101f4603e556101f4603f556064604055348015620000a057600080fd5b506040516101208062017b218339810180604052620000c39190810190620003d2565b60008760011480620000d55750876003145b80620000e15750876005145b80620000ed5750876007145b1515620000f957600080fd5b86600b1480620001095750866015145b8062000115575086601f145b80620001215750866033145b806200012d5750866063145b15156200013957600080fd5b602885101580156200014d57506101f48511155b15156200015957600080fd5b5060058490556006849055602b8054600160a060020a031916600160a060020a038a8116919091179091556040517fde42f13c0000000000000000000000000000000000000000000000000000000081528a9182169063de42f13c90620001c79089908c90600401620004f9565b602060405180830381600087803b158015620001e257600080fd5b505af1158015620001f7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506200021d9190810190620004a9565b60038190555080600160a060020a031663365bfb9e6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b1580156200027b57600080fd5b505af115801562000290573d6000803e3d6000fd5b505050600189905550600287905560008054600160a060020a031916600160a060020a038c161781556004908155600e8054600160a060020a03191633179055600580546040517fb8a167e6000000000000000000000000000000000000000000000000000000008152600160a060020a0385169363b8a167e6936200031993029101620004e3565b600060405180830381600087803b1580156200033457600080fd5b505af115801562000349573d6000803e3d6000fd5b5050600019600d555050670de0b6b3a7640000840260315560418390556011805461ffff19166101001790556000602a8190556030555060458054600160a060020a031916600160a060020a039290921691909117905550620005279650505050505050565b6000620003bd82516200051b565b9392505050565b6000620003bd825162000518565b60008060008060008060008060006101208a8c031215620003f257600080fd5b6000620004008c8c620003af565b9950506020620004138c828d01620003af565b9850506040620004268c828d01620003c4565b9750506060620004398c828d01620003c4565b96505060806200044c8c828d01620003c4565b95505060a06200045f8c828d01620003c4565b94505060c0620004728c828d01620003c4565b93505060e0620004858c828d01620003c4565b925050610100620004998c828d01620003af565b9150509295985092959850929598565b600060208284031215620004bc57600080fd5b6000620004ca8484620003c4565b949350505050565b620004dd8162000518565b82525050565b60208101620004f38284620004d2565b92915050565b60408101620005098285620004d2565b620003bd6020830184620004d2565b90565b600160a060020a031690565b620175e980620005386000396000f300608060405260043610620005095763ffffffff60e060020a60003504166303d0592381146200052357806303e3c9ac14620005485780630728924514620005785780630ac168a114620005905780630be6075a14620005a85780630d31454614620005c0578063110afc0f14620005d857806311f79f7c14620005fd5780631463ef07146200062257806315e9977e1462000656578063208f2a31146200066e57806321a1b49514620006a257806326009deb14620006ca5780632ad0f79b14620006e25780632b114a7c14620007075780632da03719146200071f578063301b4887146200074657806330be5944146200076b57806330e7f8ef1462000790578063312e014b14620007a857806332ed5b1214620007cd5780633a46492a146200080b5780633b08270614620008305780633c1f16aa146200085557806340caae06146200087c57806342cbb15c146200089457806343d726d614620008ac57806344a5878114620008c457806346d6367614620008fa5780634d13deae146200091257806350859fd91462000929578063517549a0146200094e57806357365df214620009735780635defc56c14620009985780635f5ffef014620009b05780635fd652db14620009c8578063634eaea614620009e0578063689b00ed14620009f857806369f3576f1462000a1d5780636b35d3671462000a355780636bbded701462000a5a5780636d9817eb1462000a645780636da49b831462000a895780636f7e15da1462000aa15780636f8c54b51462000ac657806376164fb61462000aeb578063793ebd891462000b035780637a8138331462000b1b57806383d6f6971462000b335780638640c8b11462000b4b578063898739271462000b725780638ce744261462000b97578063950f78791462000baf5780639b09723e1462000bc75780639d3979a11462000bdf5780639e75143c1462000bf75780639eb34e431462000c0f578063a2f09dfa1462000c27578063a53dae591462000c31578063a5824de11462000c49578063a7fc11611462000c61578063a94f7a701462000c79578063a9555e6c1462000c9e578063aa7e29861462000cc3578063ab3c7d871462000ce8578063b062a9271462000d00578063b19932c01462000d18578063b55845e71462000d4f578063b74c3eff1462000d67578063b85988961462000d9b578063b8697fe21462000dc0578063be93f1b31462000dd8578063bff92d701462000dfd578063c063d9871462000e15578063c067247c1462000e4a578063c20b12461462000e62578063c4474a591462000e87578063c66da9971462000e9f578063c7f758a81462000ec4578063ca3b852f1462000ef8578063ca5e56aa1462000f10578063cae56d581462000f35578063cbe5b2a41462000f5a578063cc819ad01462000f8e578063d0fab8851462000fb3578063d12ff2eb1462000fd8578063d4f79bd51462000ff0578063d736b3821462001008578063d7c3dc5f1462001020578063d826f88f1462001038578063db22ccad1462001050578063dc393c091462001068578063dc82c54f1462001080578063dcd338ca1462001098578063df4b780d14620010bd578063e3bbb4f114620010e2578063e5df842514620010fa578063e9e150d01462001112578063eba308f8146200112a578063f21df0121462001142578063f2faa2a6146200115a578063f3fef3a31462001172578063f9326cf51462001197578063fae67d4014620011af578063fcac00bc14620011c7575b600054600160a060020a031633146200052157600080fd5b005b3480156200053057600080fd5b506200052162000542366004620070da565b620011df565b3480156200055557600080fd5b506200056062001219565b6040516200056f919062007c4e565b60405180910390f35b3480156200058557600080fd5b50620005606200121f565b3480156200059d57600080fd5b506200056062001225565b348015620005b557600080fd5b50620005606200122b565b348015620005cd57600080fd5b506200056062001231565b348015620005e557600080fd5b5062000521620005f7366004620072eb565b62001237565b3480156200060a57600080fd5b50620005216200061c366004620070da565b62001347565b3480156200062f57600080fd5b5062000647620006413660046200732d565b62001434565b6040516200056f919062007c3e565b3480156200066357600080fd5b5062000560620019a6565b3480156200067b57600080fd5b50620006936200068d366004620072eb565b620019ac565b6040516200056f919062007a11565b348015620006af57600080fd5b50620006ba620019d5565b6040516200056f92919062007bc0565b348015620006d757600080fd5b506200056062001b8b565b348015620006ef57600080fd5b506200069362000701366004620070da565b62001b91565b3480156200071457600080fd5b506200056062001bac565b3480156200072c57600080fd5b506200073762001bb2565b6040516200056f919062007c5e565b3480156200075357600080fd5b5062000647620007653660046200743c565b62001c44565b3480156200077857600080fd5b50620006476200078a3660046200743c565b62001f82565b3480156200079d57600080fd5b50620005606200209e565b348015620007b557600080fd5b5062000521620007c7366004620072eb565b620020a4565b348015620007da57600080fd5b50620007f2620007ec366004620072eb565b620020fc565b6040516200056f9b9a9998979695949392919062007a46565b3480156200081857600080fd5b50620005216200082a366004620072eb565b62002161565b3480156200083d57600080fd5b50620005606200084f366004620072eb565b6200217e565b3480156200086257600080fd5b506200086d6200219e565b6040516200056f919062007c97565b3480156200088957600080fd5b506200052162002650565b348015620008a157600080fd5b506200056062002678565b348015620008b957600080fd5b50620005216200267d565b348015620008d157600080fd5b50620008e9620008e3366004620072eb565b62002732565b6040516200056f9392919062007b24565b3480156200090757600080fd5b506200056062002800565b620005216200092336600462007103565b62002806565b3480156200093657600080fd5b506200056062000948366004620070da565b62002a07565b3480156200095b57600080fd5b50620006476200096d3660046200745e565b62002bd0565b3480156200098057600080fd5b506200056062000992366004620070da565b62002d59565b348015620009a557600080fd5b506200052162002d6b565b348015620009bd57600080fd5b506200069362002da6565b348015620009d557600080fd5b506200056062002db5565b348015620009ed57600080fd5b506200052162002dbb565b34801562000a0557600080fd5b506200052162000a17366004620072eb565b62002dda565b34801562000a2a57600080fd5b506200064762002df7565b34801562000a4257600080fd5b506200056062000a54366004620070da565b6200305a565b620006476200306c565b34801562000a7157600080fd5b506200052162000a83366004620072eb565b62003181565b34801562000a9657600080fd5b50620005606200319e565b34801562000aae57600080fd5b506200052162000ac036600462007103565b620031a4565b34801562000ad357600080fd5b506200064762000ae536600462007190565b62003263565b34801562000af857600080fd5b5062000560620036ac565b34801562000b1057600080fd5b5062000560620036b2565b34801562000b2857600080fd5b5062000647620036b8565b34801562000b4057600080fd5b5062000560620036bd565b34801562000b5857600080fd5b5062000b63620036c3565b6040516200056f919062007bad565b34801562000b7f57600080fd5b506200064762000b9136600462007190565b6200372a565b34801562000ba457600080fd5b506200069362003b17565b34801562000bbc57600080fd5b506200056062003b26565b34801562000bd457600080fd5b506200056062003b2c565b34801562000bec57600080fd5b506200056062003b32565b34801562000c0457600080fd5b506200073762003b38565b34801562000c1c57600080fd5b506200056062003b5d565b6200052162003b63565b34801562000c3e57600080fd5b506200056062003c38565b34801562000c5657600080fd5b506200069362003c3e565b34801562000c6e57600080fd5b506200056062003c4d565b34801562000c8657600080fd5b506200069362000c98366004620072eb565b62003c53565b34801562000cab57600080fd5b506200056062000cbd366004620070da565b62003c62565b34801562000cd057600080fd5b506200052162000ce2366004620072eb565b62003c74565b34801562000cf557600080fd5b506200064762003c91565b34801562000d0d57600080fd5b506200056062003cae565b34801562000d2557600080fd5b5062000d3d62000d373660046200715b565b62003cb4565b6040516200056f949392919062007be9565b34801562000d5c57600080fd5b506200056062003fc3565b34801562000d7457600080fd5b5062000d8c62000d86366004620070da565b62003fc9565b6040516200056f919062007c84565b34801562000da857600080fd5b506200064762000dba36600462007210565b620040a8565b34801562000dcd57600080fd5b506200056062004174565b34801562000de557600080fd5b506200052162000df7366004620072eb565b6";
    }
}
