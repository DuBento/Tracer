// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Supplychain.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";
import "../DAO/IUserRegistry.sol";

contract SupplychainFactory is Ownable {
    address immutable defaultImplementation;
    IUserRegistry private userRegistry;

    constructor(address userRegistry_) {
        userRegistry = IUserRegistry(userRegistry_);
        defaultImplementation = address(new Supplychain());
    }

    function create(
        address supplychainManager_,
        string calldata contractDescription_
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // initialize the clone
        Supplychain(clone).init(
            userRegistry,
            msg.sender,
            supplychainManager_,
            contractDescription_
        );

        userRegistry.updateMember(supplychainManager_, clone);

        return clone;
    }
}
