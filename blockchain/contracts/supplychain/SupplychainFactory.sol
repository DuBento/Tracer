// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Supplychain.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";
import "../DAO/UserRegistry.sol";

// import "../../node_modules/hardhat/console.sol";

contract SupplychainFactory is Ownable {
    address immutable defaultImplementation;
    UserRegistry private userRegistry;

    constructor(address userRegistry_) {
        userRegistry = UserRegistry(userRegistry_);
        defaultImplementation = address(new Supplychain());
    }

    function create(
        address supplychainManager_
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // initialize the clone
        Supplychain(clone).init(userRegistry, msg.sender);

        userRegistry.updateMember(supplychainManager_, clone);

        return clone;
    }
}
