// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Type definitions
type Hash is bytes32;

enum ConformityState {
    Functioning,
    WaitingReview,
    CorrectiveMeasureNeeded
}

contract Ownable {
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(isOwner(), "Function accessible only by the owner !!");
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}
