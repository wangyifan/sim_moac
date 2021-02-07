pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

// System smart contract for verifiable secret sharing
// MOAC Inc 2017 ~ 2019

contract VssBase{
    enum SubChainStatus {open, pending, close}

    struct RevealedShare {
        bytes PubShare;
        bytes PubSig;
        bytes PriShare;
        bytes PriSig;
        bytes Revealed;
        address Violator;
        address Whistleblower;
    }
    
    struct VnodeInfo {
        uint initNodeCount;
        uint subchainstatus;
        address owner;
        uint256 BALANCE;
        address[] nodeList;
        address[] nodesToJoin;
    }
    
    struct NodesToJoin {
        address nodeAddr;
        uint8 status;
        address[] voteNodeList;
    }
    
    struct transformNodeVote {
        mapping(address => bool) vote;
        uint voteNum;
        bool done;
    }

    mapping(address => bytes32) private vssPublicKeys;
    mapping(address => uint) private vssNodeIndexs;  // value start from 0
    mapping(uint => address) private reverseVSSNodeIndexs; // key start from 0, reverse of vssNodeIndexs
    mapping(address => uint) public vssNodeMemberships; // Indicates if the node is still in the vss group
    mapping(address => bytes) private vssPublicShares; // nodeID => list of public shares in json
    mapping(address => bytes) private vssPrivateShares; // nodeID => list of private shares in json

    // vote and slashing related data
    mapping(int => int) public votes; // config version => # of votes
    // config nested mapping config_version => (voter address => if voted or not for the config version)
    mapping(int => mapping(address => bool)) public voters;
    // slash index => number of slashing votes
    mapping(int => int) public slashingVotes;
    // slash index => number of reject votes
    mapping(int => int) public slashingRejects;
    // slash index => violator address  => voter => if voted
    mapping(int => mapping(address => bool)) public slashingVoters;
    // config version => number of total slashing votes
    mapping(int => int) public slashed;
    // check if share is revealed already
    mapping(bytes32 => bool) public revealed;
    // record the violator address of the revealed share
    mapping(int => address) public revealedViolator;
    // record the reporter address of the revealed share
    mapping(int => address) public revealedReporter;
    // record the actual revealed share
    mapping(int => RevealedShare) public reveals;
    // record index of last slashing voted
    mapping(address => int) public lastSlashingVoted;
    // mapping from sig sha to slash index
    mapping(bytes32 => int) public revealedSigMapping;
    // mapping from scs to its last config upload
    mapping(address => int) public lastConfigUpload;
    // mapping from scs to the block number of its last config upload
    mapping(address => int) public lastConfigUploadByBlock;
    // mapping from violator address to (inccident id => number of votes)
    mapping(address => mapping(int => uint)) public slowNodeVotes;
    // mapping from violator address to (inccident id => whether voted or not)
    mapping(address => mapping(int => mapping(address => bool))) public slowNodeVoted;
    
    mapping(bytes32 => transformNodeVote) public transformNodeVoteMap;

    address public owner;
    uint256 internal subchainstatus;
    uint256 public BALANCE = 0;
    int public vssThreshold = 0;
    uint public vssNodeCount = 0;
    uint public initNodeCount = 0;
    address[] public nodeList;
    mapping(address => uint8) public nodesToJoinMap;
    address[] public nodesToJoin;
    mapping(address => address[]) public nodesVotedMap;
    mapping(address => uint) public nodesWatching;
    int public vssConfigVersion = 0;
    int public revealIndex = 0;
    int public lastNodeChangeConfigVersion = 0;
    int public lastNodeChangeBlock = 0;
    int public slowNodeThreshold = 30; // number of blocks
    uint public transformNodePeriod = 0;

    enum VssMembership {noreg, active, inactive} // noreg: node never seen before

    function VssBase(uint nodeCount, uint tokenSupply, address chainOwner, uint _transformNodePeriod) public {
        initNodeCount = nodeCount;
        owner = chainOwner;
        subchainstatus = uint(SubChainStatus.open);
        BALANCE = tokenSupply * 10 ** 18;
        transformNodePeriod = _transformNodePeriod;
        vssThreshold = int(initNodeCount);
        if (vssThreshold > 2) {
            vssThreshold = vssThreshold * 2 / 3;
        }
    }

    function setOwner(address newOwner) public {
        require(owner == msg.sender);
        owner = newOwner;
    }
    
    function getVnodeInfo() public view returns (VnodeInfo) {
        VnodeInfo vnodeinfo;

        vnodeinfo.initNodeCount = initNodeCount;
        vnodeinfo.subchainstatus = subchainstatus;
        vnodeinfo.owner = owner;
        vnodeinfo.BALANCE = BALANCE;
        
        vnodeinfo.nodeList = getActiveVSSMemberList();
        vnodeinfo.nodesToJoin = nodesToJoin;

        return vnodeinfo;
    }
    
    function getUserRole(address scs) public view returns (uint) {
        uint i = 0;

        if (owner == scs) {
            return 1;
        }
        
        address[] memory nodeList = getActiveVSSMemberList();
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i] == scs) {
                return 2;
            }
        }
        
        if (nodesToJoinMap[scs] == 1 || nodesToJoinMap[scs] == 2) {
            return 3;
        }
        
        return 0;
    }
    
    function getNodesToJoin() public view returns (NodesToJoin[]) {
        uint i = 0;
        address nodeAddr;
        NodesToJoin[] memory nodesToJoinList = new NodesToJoin[](nodesToJoin.length);
        
        for (i = 0; i < nodesToJoin.length; i++) {
            nodeAddr = nodesToJoin[i];
            nodesToJoinList[i].nodeAddr = nodeAddr;
            nodesToJoinList[i].status = nodesToJoinMap[nodeAddr];
            nodesToJoinList[i].voteNodeList = nodesVotedMap[nodeAddr];
        }
        return nodesToJoinList;
    }
    
    function getSCSRole(address scs) public view returns (uint) {
        uint i = 0;

        address[] memory nodeList = getActiveVSSMemberList();
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i] == scs) {
                return 1;
            }
        }
        
        if (nodesToJoinMap[scs] == 2) {
            return 3;
        }

        if (nodesWatching[scs] > 0) {
            return 2;
        }

        return 0;
    }

    function registerVSS(bytes32 publickey) public {
        // if it is a node we know before which is active, return
        if (vssNodeMemberships[msg.sender] == uint(VssMembership.active)) {
            return;
        }
        
        // if it is a node we never seen before which is noreg
        if (vssNodeMemberships[msg.sender] == uint(VssMembership.noreg)) {
            if (vssNodeCount >= initNodeCount) {
                if (nodesWatching[msg.sender] == 0) {
                    nodesWatching[msg.sender] = 1;
                    nodeList.push(msg.sender);
                }
            } else {
                vssNodeIndexs[msg.sender] = vssNodeCount;
                reverseVSSNodeIndexs[vssNodeCount] = msg.sender;
                vssNodeCount++;
                vssNodeMemberships[msg.sender] = uint(VssMembership.active);
                lastNodeChangeConfigVersion = vssConfigVersion;
                lastNodeChangeBlock = int(block.number);
                nodeList.push(msg.sender);
            }
        }
        vssPublicKeys[msg.sender] = publickey;
    }
    
    function transformNode(uint blockNumber, uint[] indexList) public {
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        require(blockNumber % transformNodePeriod == 0);
        require(indexList.length == vssNodeCount);
        
        bytes32 hash = sha3(blockNumber, indexList);
        if (transformNodeVoteMap[hash].done || transformNodeVoteMap[hash].vote[msg.sender]) return;
        transformNodeVoteMap[hash].vote[msg.sender] = true;
        transformNodeVoteMap[hash].voteNum++;
        if (transformNodeVoteMap[hash].voteNum >= uint(vssThreshold)) {
            address nodeAddr;
            for (uint i = 0; i < vssNodeCount; i++) {
                nodeAddr = reverseVSSNodeIndexs[i];
                delete vssNodeMemberships[nodeAddr];
                delete vssNodeIndexs[nodeAddr];
                delete reverseVSSNodeIndexs[i];
                nodesWatching[nodeAddr] = 1;
            }
            
            for (i = 0; i < vssNodeCount; i++) {
                nodeAddr = nodeList[indexList[i]];
                vssNodeIndexs[nodeAddr] = i;
                reverseVSSNodeIndexs[i] = nodeAddr;
                vssNodeMemberships[nodeAddr] = uint(VssMembership.active);
                nodesWatching[nodeAddr] = 0;
            }
            
            lastNodeChangeConfigVersion = vssConfigVersion;
            lastNodeChangeBlock = int(block.number);
            transformNodeVoteMap[hash].done = true;
        }
    }
    
    function getNodeCount() public view returns(uint) {
        return nodeList.length;
    }

    function unregisterVSS() public {
        removeNode(msg.sender);
    }

    function uploadVSSConfig(bytes publicShares, bytes privateShares) public {
        // only active member can upload vss config
        if (vssNodeMemberships[msg.sender] != uint(VssMembership.active)) {
            return;
        }

        vssPublicShares[msg.sender] = publicShares;
        vssPrivateShares[msg.sender] = privateShares;
        vssConfigVersion++;
        lastConfigUpload[msg.sender] = vssConfigVersion;
        lastConfigUploadByBlock[msg.sender] = int(block.number);
    }

    function vote(int configVersion) public {
        // must be active member and can not vote twice
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        require(voters[configVersion][msg.sender] == false);

        votes[configVersion] += 1;
        voters[configVersion][msg.sender] = true;
    }
    
    // use reportSlowNode to report node that's slow in uploading new config after node change
    function reportSlowNode(address violator) public {
        // must be active member to report
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));

        int currentBlockNumber = int(block.number);
        int nodeUploadBlockNumber = lastConfigUploadByBlock[violator];
        // if it's behind node change config version and is too far ( > slowNodeThreshold) away
        if (lastConfigUpload[violator] < lastNodeChangeConfigVersion && (currentBlockNumber - lastNodeChangeBlock) > slowNodeThreshold) {
            // one node can only report once for one inccident
            if (slowNodeVoted[violator][nodeUploadBlockNumber][msg.sender] == false) {
                slowNodeVotes[violator][nodeUploadBlockNumber] += 1;
                slowNodeVoted[violator][nodeUploadBlockNumber][msg.sender] = true;
            }

            // if more than threshold nodes report, then slash the violator
            if (slowNodeVotes[violator][nodeUploadBlockNumber] >= uint(vssThreshold)) {
                removeNode(violator);
            }
        }
    }

    // use reveal to upload shares sent by other member nodes
    function reveal(address violator, bytes pubShare, bytes pubSig, bytes priShare, bytes priSig, bytes revealedPri) public {
        // must be active member to call reveal
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        bytes32 sigSha = keccak256(pubSig, priSig);
        require(revealed[sigSha] == false);

        revealedViolator[revealIndex] = violator;
        revealedReporter[revealIndex] = msg.sender;
        reveals[revealIndex] = RevealedShare({
            PubShare: pubShare,
            PubSig: pubSig,
            PriShare: priShare,
            PriSig: priSig,
            Revealed: revealedPri,
            Violator:violator,
            Whistleblower: msg.sender
        });
        revealed[sigSha] = true;
        revealedSigMapping[sigSha] = revealIndex;
        revealIndex += 1;

        // after reveal, at least one of the private keys is public.
        // we need to notify the whole group to run vss protocol again
        // SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.vssGroupConfig));
    }

    function getRevealedShare(int index) public returns(RevealedShare){
        return reveals[index];
    }

    function slashing(int index, bool slash) public {
        // must be active member to call slashing
        require(vssNodeMemberships[msg.sender] == uint(VssMembership.active));
        // can not slash twice
        require(slashingVoters[index][msg.sender] == false);

        // mark we slashed
        slashingVoters[index][msg.sender] = true;
        address toBeSlashed;

        // slash in the subchainbase contract
        if (slash == true) {
            slashingVotes[index] += 1;
            if (slashingVotes[index] >= vssThreshold) {
                toBeSlashed = revealedViolator[index];
                removeNode(toBeSlashed);
            }
        } else {
            slashingRejects[index] += 1;
            if (slashingRejects[index] >= vssThreshold) {
                toBeSlashed = revealedReporter[index];
                removeNode(toBeSlashed);
            }
        }

        // update last slash index only if current one is higher
        if (index > lastSlashingVoted[msg.sender]) {
            lastSlashingVoted[msg.sender] = index;
        }
    }

    function getLastSlashVoted(address addr) public view returns(int) {
        return  lastSlashingVoted[addr];
    }
    
    function getBlockNumber() public view returns(int) {
        return int(block.number);
    }

    function isConfigReady(int configVersion) public view returns(bool) {
        if (votes[configVersion] >= vssThreshold) {
            return true;
        }

        return false;
    }

    function isSlashed(int configVersion) public view returns(bool) {
        return slashed[configVersion] > 0;
    }

    function getPublicShares(address node) public view returns(bytes) {
        return vssPublicShares[node];
    }

    function getPrivateShares(address node) public view returns(bytes) {
        return vssPrivateShares[node];
    }

    function getVSSNodesPubkey(address[] nodes) public view returns (bytes32[]) {
        uint n = nodes.length;
        bytes32[] memory publickeys = new bytes32[](n);
        for(uint i = 0; i < nodes.length; i++) {
            publickeys[i] = vssPublicKeys[nodes[i]];
        }
        return publickeys;
    }

    function getActiveVSSMemberCount() public view returns (int) {
        int result = 0;
        for(uint i=0;i<vssNodeCount;i++) {
            if (vssNodeMemberships[reverseVSSNodeIndexs[i]] == uint(VssMembership.active)) {
                result++;
            }
        }

        return result;
    }

    function getActiveVSSMemberList() public view returns (address[]) {
        int n = getActiveVSSMemberCount();
        address[] memory addressList = new address[](uint(n));
        uint index = 0;
        for(uint i = 0;i < vssNodeCount; i++) {
            if (vssNodeMemberships[reverseVSSNodeIndexs[i]] == uint(VssMembership.active)) {
                addressList[index] = reverseVSSNodeIndexs[i];
                index++;
            }
        }

        return addressList;
    }

    function getVSSNodesIndexs(address[] nodes) public view returns (uint[]) {
        uint n = nodes.length;
        uint[] memory indexs = new uint[](n);
        for(uint i = 0; i < nodes.length; i++) {
            indexs[i] = vssNodeIndexs[nodes[i]];
        }
        return indexs;
    }

    function getVSSNodeIndex(address scs) public view returns (uint) {
        return vssNodeIndexs[scs];
    }

    function removeNode(address addr) private {
        if (vssNodeMemberships[addr] == uint(VssMembership.active)) {
            vssNodeMemberships[addr] = uint(VssMembership.inactive);
            lastNodeChangeConfigVersion = vssConfigVersion;
            lastNodeChangeBlock = int(block.number);
            nodesWatching[addr] = 1;
        }
    }
}
