// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Supplychain.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";

contract SupplychainFactory is Ownable {
    mapping(address => address) public supplychainContracts;
    address immutable defaultImplementation;

    constructor(address supplychainManagingContract_) {
        defaultImplementation = address(
            new Supplychain(supplychainManagingContract_)
        );
    }

    function create(
        address supplychainManager
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // initialize the clone
        Supplychain(clone).init(msg.sender);

        supplychainContracts[supplychainManager] = clone;
        return clone;
    }
}
