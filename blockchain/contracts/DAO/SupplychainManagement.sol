// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./UserRegistry.sol";

contract SupplychainManagement {
    // Type declarations
    // State variables
    UserRegistry private userRegistry;

    mapping(address => address[]) public participatingContracts;

    // Events
    // Errors
    error UserCannotManageContract();

    // Modifiers
    modifier onlyContractManager(address contractAddress_) {
        _assertOpFromContractManager(msg.sender, contractAddress_);
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
    function addContractToActor(
        address contract_,
        address actor_
    ) public onlyContractManager(contract_) {
        participatingContracts[actor_].push(contract_);
    }

    function checkAccess(
        address contract_,
        address addr_
    ) public view returns (bool) {
        address[] memory contracts = participatingContracts[addr_];
        for (uint i = 0; i < contracts.length; i++) {
            if (contracts[i] == contract_) {
                return true;
            }
        }
        return false;
    }

    //* internal
    //* private
    //* asserts
    function _assertOpFromContractManager(
        address sender_,
        address contractAddress_
    ) internal view {
        if (
            userRegistry.getManagingContractAddress(sender_) != contractAddress_
        ) revert UserCannotManageContract();
    }
}
