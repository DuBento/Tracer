// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../OpenZeppelin/governance/TimelockController.sol";

contract GovernorTimelock is TimelockController {
    /* 
    Timelock contract works as the owner of other contracts,
    will execute the proposal after the delay time and
    offer a time period for users to opt out
    */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
