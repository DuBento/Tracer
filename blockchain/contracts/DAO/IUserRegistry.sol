// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../ConformityState.sol";

/** @dev @TODO docs
 */
abstract contract IUserRegistry {
    uint8 constant MAX_VOTING_POWER = 49;
    // Errors
    error UserAlreadyExists();
    error MemberDoesNotExist();
    error ActorDoesNotExist();
    error TransactionNotFromOriginalActorAddress();
    error UserCannotManageContract();
    error InvalidVotingPower(uint8 votingPower);

    function setSupplychainFactoryAddress(address addr_) external virtual;

    function getVotes(address member_) public view virtual returns (uint8);

    function getManagingContractAddress(
        address addr_
    ) public view virtual returns (address);

    function addMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_,
        uint8 votingPower_
    ) public virtual;

    function updateMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public virtual;

    function updateMember(
        address addr_,
        address managingContractAddress_
    ) public virtual;

    function updateMemberState(
        address addr_,
        ConformityState.State newState_
    ) public virtual;

    function addActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public virtual;

    function updateActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public virtual;

    function updateActorState(
        address addr_,
        ConformityState.State newState_
    ) public virtual;

    function addContractToActor(
        address contract_,
        address actor_
    ) public virtual;

    function checkAccess(
        address contract_,
        address addr_
    ) public view virtual returns (bool);
}