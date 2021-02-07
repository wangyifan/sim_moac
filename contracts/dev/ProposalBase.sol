pragma solidity ^0.4.11;
pragma experimental ABIEncoderV2;

contract ProposalBase {
    enum ProposalFlag {noState, pending, disputed, approved, rejected, expired, pendingAccept}
    enum ProposalCheckStatus {undecided, approval, expired}

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

    mapping(bytes32 => Proposal) public proposals;  //index: 12

    function getProposal(uint types) public view returns (Proposal) {
        if (types == 1) {
            return proposals[proposalHashInProgress];
        } else if (types == 2) {
            return proposals[proposalHashApprovedLast];
        }
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
        uint gasinit = msg.gas; //gasleft();
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
}
