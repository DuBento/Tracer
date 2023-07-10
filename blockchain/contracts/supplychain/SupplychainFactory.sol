// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./Supplychain.sol";
import "../custom/Clone.sol";
import "../custom/Ownable.sol";
import "../DAO/SupplychainManagement.sol";
import "../DAO/UserRegistry.sol";

contract SupplychainFactory is Ownable {
    address immutable defaultImplementation;
    UserRegistry private userRegistry;
    SupplychainManagement private supplychainManagementContract;

    constructor(address userRegistry_, address supplychainManagingContract_) {
        userRegistry = UserRegistry(userRegistry_);
        supplychainManagementContract = SupplychainManagement(
            supplychainManagingContract_
        );
        defaultImplementation = address(
            new Supplychain(supplychainManagingContract_)
        );
    }

    function create(
        address supplychainManager_
    ) external onlyOwner returns (address) {
        address clone = Clones.clone(defaultImplementation);

        // initialize the clone
        Supplychain(clone).init(msg.sender);

        userRegistry.updateMember(supplychainManager_, clone);
        supplychainManagementContract.addContractToActor(
            clone,
            supplychainManager_
        );
        return clone;
    }
}
