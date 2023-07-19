// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract Ownable {
    address public owner;

    error UserNotOwner();
    error ForbiddenTransferToZeroAddress();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        console.log("== Contract Address:", address(this));
        console.log("Owner:", owner);
        console.log("Msg sender:", msg.sender);
        _assertIsOwner();
        _;
    }

    /** 
        @dev For use after cloning a contract, where initial memory is 0
    */
    function init(address sender_) public {
        if (owner == address(0)) owner = sender_;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner == address(0)) revert ForbiddenTransferToZeroAddress();
        owner = newOwner;
    }

    function _assertIsOwner() internal view {
        if (!isOwner()) revert UserNotOwner();
    }
}
