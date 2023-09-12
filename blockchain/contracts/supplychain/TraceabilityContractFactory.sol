// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Traceability.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";
import "../DAO/IUserRegistry.sol";

contract TraceabilityContractFactory is Ownable {
    address immutable defaultImplementation;
    IUserRegistry private userRegistry;

    constructor(address userRegistry_) {
        userRegistry = IUserRegistry(userRegistry_);
        defaultImplementation = address(new Traceability());
    }

    function create(
        address supplychainManager_,
        string calldata contractDescription_
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // initialize the clone
        Traceability(clone).init(
            userRegistry,
            msg.sender,
            supplychainManager_,
            contractDescription_
        );

        userRegistry.updateMember(supplychainManager_, clone);

        return clone;
    }
}
