pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

// To compile, use solc (not solc js)
// solc --optimize --combined-json abi,bin-runtime solidity/chainAttributes.sol

contract ChainAttributes {
    mapping(string => string) internal attributes;
    address public owner;

    function setOwner(address newOwner) public
    {
        // if owner is not set
        if (owner == address(0)) {
            owner = newOwner;
        } else {
            // if owner is set, only allow updates from owner
            require(msg.sender == owner);
            owner = newOwner;
        }
    }

    function setAttribute(string attrName, string attrValue) public {
        require(owner==msg.sender);

        attributes[attrName] = attrValue;
    }

    function getAttribute(string attrName) public view returns (string) {
        return attributes[attrName];
    }
}
