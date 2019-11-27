pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

// System smart contract for verifiable secret sharing
// MOAC Inc 2017 ~ 2019

contract SCSRelay {
    // 0-registeropen
    // 1-registerclose
    // 2-createproposal
    // 3-disputeproposal
    // 4-approveproposal
    // 5-registeradd
    function notifySCS(address cnt, uint msgtype) public returns (bool success);
}

contract SubChainBase {
    function getSCSRole(address scs) public view returns (uint);
}

contract VssBase{
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
      requestRelease,
      rngEnabled,
      rngGroupConfig,
      distributeProposalAndRNGGroupConfig,
      rngReveal
    }

    // system contract
    SCSRelay internal constant SCS_RELAY = SCSRelay(0x000000000000000000000000000000000000000d);

    struct VSSShare {
        bytes pubShare;
        bytes pubSig;
        bytes priShare;
        bytes priSig;
        address violator;
    }

    mapping(address => bytes32) private rngPublicKeys;
    mapping(address => int) private rngNodeIndexs;  // value start from 0
    mapping(int => address) private reverseRNGNodeIndexs; // key start from 0, reverse of rngNodeIndexs
    mapping(address => uint) private rngNodeMemberships; // Indicates if the node is still in the rng group
    mapping(address => bytes) private rngPublicShares; // nodeID => list of public shares in json
    mapping(address => bytes) private rngPrivateShares; // nodeID => list of private shares in json

    // vote and slashing related data
    mapping(int => int) private votes; // config version => # of votes
    // config nested mapping config_version => (voter address => if voted or not for the config version)
    mapping(int => mapping(address => bool)) private voters;
    // config version => violator address => number of slashing votes
    mapping(bytes32 => int) private slashingVotes;
    // config version => violator address  => voter => if voted
    mapping(bytes32 => mapping(address => bool)) private slashingVoters;
    // config version => number of total slashing votes
    mapping(int => int) private slashed;
    // check if share is revealed already
    mapping(bytes32 => bool) private revealed;
    // record the violator address of the revealed share
    mapping(bytes32 => address) private revealedViolator;
    // record the actual revealed share
    mapping(int => VSSShare) private reveals;
    // record index of last slashing voted
    mapping(address => int) private lastSlashingVoted;
    // mapping from sig sha to slash index
    mapping(bytes32 => int) private revealedSigMapping;

    address public owner;
    address public caller; // this should set to the related subchainbase address
    address public lastSender;
    int public rngThreshold = 0;
    int public rngNodeCount = 0;
    int public rngConfigVersion = 0;
    int public revealIndex = 0;

    enum RngMembership {noreg, active, inactive} // noreg: node never seen before

    function VssBase(int threshold) public {
        rngThreshold = threshold;
        owner = msg.sender;
    }

    function setCaller(address callerAddr) public {
        require(owner == msg.sender);
        caller = callerAddr;
    }

    function registerVSS(address sender, bytes32 publickey) public {
        require(caller == msg.sender);

        lastSender = msg.sender;
        rngPublicKeys[sender] = publickey;
    }

    function unregisterVSS(address sender) public {
        require(caller == msg.sender);
        lastSender = msg.sender;

        if (rngNodeMemberships[sender] == uint(RngMembership.active)) {
            rngNodeMemberships[sender] = uint(RngMembership.inactive);
        }
    }

    function activateVSS(address sender) public {
        require(caller == msg.sender);
        lastSender = msg.sender;

        // if it is a node we never seen before which is noreg
        if (rngNodeMemberships[sender] == uint(RngMembership.noreg)) {
            rngNodeIndexs[sender] = rngNodeCount;
            reverseRNGNodeIndexs[rngNodeCount] = sender;
            rngNodeCount++;
            rngNodeMemberships[sender] = uint(RngMembership.active);
        }

        // if it is a node we know before, just re-active it
        if (rngNodeMemberships[sender] == uint(RngMembership.inactive)) {
            rngNodeMemberships[sender] = uint(RngMembership.active);
        }
    }

    function uploadVSSConfig(bytes publicShares, bytes privateShares) public {
        // only active member can upload rng config
        if (rngNodeMemberships[msg.sender] != uint(RngMembership.active)) {
            return;
        }

        rngPublicShares[msg.sender] = publicShares;
        rngPrivateShares[msg.sender] = privateShares;
        rngConfigVersion++;
    }

    function vote(int configVersion) public {
        // must be active member and can not vote twice
        require(rngNodeMemberships[msg.sender] == uint(RngMembership.active));
        require(voters[configVersion][msg.sender] == false);

        votes[configVersion] += 1;
        voters[configVersion][msg.sender] = true;
    }

    // use reveal to upload shares sent by other member nodes
    function reveal(address violator, bytes pubShare, bytes pubSig, bytes priShare, bytes priSig) public {
        // must be active member to call reveal
        require(rngNodeMemberships[msg.sender] == uint(RngMembership.active));
        bytes32 sigSha = keccak256(pubSig, priSig);
        require(revealed[sigSha] == false);

        revealedViolator[sigSha] = violator;
        reveals[revealIndex] = VSSShare({
            pubShare: pubShare,
            pubSig: pubSig,
            priShare: priShare,
            priSig: priSig,
            violator:violator
        });
        revealed[sigSha] = true;
        revealedSigMapping[sigSha] = revealIndex;
        revealIndex += 1;
    }

    function getRevealedShare(int index) public returns(VSSShare){
        return reveals[index];
    }

    function slashing(bytes pubSig, bytes priSig) public {
        // must be active member to call slashing
        require(rngNodeMemberships[msg.sender] == uint(RngMembership.active));

        // can not slash twice
        bytes32 sigSha = keccak256(pubSig, priSig);
        require(slashingVoters[sigSha][msg.sender] == false);

        slashingVotes[sigSha] += 1;
        slashingVoters[sigSha][msg.sender] = true;

        // update last slash index only if current one is higher
        if (revealedSigMapping[sigSha] > lastSlashingVoted[msg.sender]) {
            lastSlashingVoted[msg.sender] = revealedSigMapping[sigSha];
        }

        if (slashingVotes[sigSha] >= rngThreshold) {
            address violator = revealedViolator[sigSha];
            // slash the violator in subchainbase contract
        }
    }

    function getLastSlashVoted() public view returns(int) {
        return lastSlashingVoted[msg.sender];
    }

    function isConfigReady(int configVersion) public view returns(bool) {
        if (votes[configVersion] >= rngThreshold) {
            return true;
        }

        return false;
    }

    function isSlashed(int configVersion) public view returns(bool) {
        return slashed[configVersion] > 0;
    }

    function GetLastSender() public view returns(address) {
        return lastSender;
    }

    function GetCaller() public view returns(address) {
        return caller;
    }

    function getRNGConfigVersion() public view returns(int) {
        return rngConfigVersion;
    }

    function getPublicShares(address node) public view returns(bytes) {
        return rngPublicShares[node];
    }

    function getPrivateShares(address node) public view returns(bytes) {
        return rngPrivateShares[node];
    }

    function getVSSNodesPubkey(address[] nodes) public view returns (bytes32[]) {
        uint n = nodes.length;
        bytes32[] memory publickeys = new bytes32[](n);
        for(uint i = 0; i < nodes.length; i++) {
            publickeys[i] = rngPublicKeys[nodes[i]];
        }
        return publickeys;
    }

    function getActiveVSSMemberCount() public view returns (int) {
        int result = 0;
        for(int i=0;i<rngNodeCount;i++) {
            if (rngNodeMemberships[reverseRNGNodeIndexs[i]] == uint(RngMembership.active)) {
                result++;
            }
        }

        return result;
    }

    function getActiveVSSMemberList() public view returns (address[]) {
        int n = getActiveVSSMemberCount();
        address[] memory addressList = new address[](uint(n));
        uint index = 0;
        for(int i = 0;i < rngNodeCount; i++) {
            if (rngNodeMemberships[reverseRNGNodeIndexs[i]] == uint(RngMembership.active)) {
                addressList[index] = reverseRNGNodeIndexs[i];
                index++;
            }
        }

        return addressList;
    }

    function getVSSNodesIndexs(address[] nodes) public view returns (int[]) {
        uint n = nodes.length;
        int[] memory indexs = new int[](n);
        for(uint i = 0; i < nodes.length; i++) {
            indexs[i] = rngNodeIndexs[nodes[i]];
        }
        return indexs;
    }

    function getVSSNodeIndex(address scs) public view returns (int) {
        return rngNodeIndexs[scs];
    }

    // vnode call this function to determine the role
    function getSCSRole(address scs) public view returns (uint) {
        SubChainBase subchainbaseContract = SubChainBase(caller);
        return subchainbaseContract.getSCSRole(scs);
    }

/*
    function resetRNGGroup() public {
        require(owner == msg.sender);
        SCS_RELAY.notifySCS(address(this), uint(SCSRelayStatus.rngGroupConfig));
    }*/
}
