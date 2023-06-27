// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Supplychain.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";

contract SupplychainFactory is Ownable {
    mapping(address => address) public supplychainContracts;
    address immutable defaultImplementation;

    constructor() {
        defaultImplementation = address(new Supplychain());
    }

    function create(
        address supplychainManager
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // OPT: initialize the clone
        // Supplychain(clone).initialize(...);

        supplychainContracts[supplychainManager] = clone;
        return clone;
    }
}
