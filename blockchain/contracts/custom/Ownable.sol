// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../../node_modules/hardhat/console.sol";

contract Ownable {
    address public owner;

    error UserNotOwner();
    error ForbiddenTransferToZeroAddress();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (!isOwner()) revert UserNotOwner();
        _;
    }

    /** 
        @dev For use after cloning a contract, where initial memory is 0
    */
    function init(address sender_) external {
        if (owner == address(0)) owner = sender_;
        console.log("Ownable init called, owner:", owner);
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner == address(0)) revert ForbiddenTransferToZeroAddress();
        owner = newOwner;
    }
}
