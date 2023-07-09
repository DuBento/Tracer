// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./UserRegistry.sol";

contract SupplychainManagement {
    // Type declarations
    // State variables
    UserRegistry private userRegistry;

    mapping(address => address[]) public allowedActors;

    // Events
    // Errors
    error UserCannotManageContract();
    // Modifiers
    modifier onlyContractManager(address contractAddress_) {
        assertOpFromContractManager(msg.sender, contractAddress_);
        _;
    }

    // Functions
    //* constructor
    constructor(UserRegistry userRegistry_) {
        userRegistry = userRegistry_;
    }

    //* receive function
    //* fallback function (if exists)
    //* external
    //* public
    function addActor(
        address contract_,
        address actor_
    ) public onlyContractManager(contract_) {
        allowedActors[contract_].push(actor_);
    }

    //* internal
    //* private
    //* asserts
    function assertOpFromContractManager(
        address sender_,
        address contractAddress_
    ) internal view {
        if (
            userRegistry.getManagingContractAddress(sender_) != contractAddress_
        ) revert UserCannotManageContract();
    }
}
