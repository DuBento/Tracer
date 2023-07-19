// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../ConformityState.sol";

contract UserRegistry is Ownable, ConformityState {
    // Type declarations
    struct Member {
        address addr;
        string name;
        string infoURI;
        uint256 votingPower;
        ConformityState.State state;
        address managingContractAddress;
    }

    struct Actor {
        address addr;
        string name;
        string infoURI;
        ConformityState.State state;
        address[] participatingContracts;
    }

    // State variables
    mapping(address => Member) public members;
    mapping(address => Actor) public actors;

    address private supplychainFactory;
    address private governorToken;

    // Events

    // Errors
    error UserAlreadyExists();
    error MemberDoesNotExist();
    error ActorDoesNotExist();
    error TransactionNotFromOriginalActorAddress();
    error UserCannotManageContract();

    // Modifiers
    modifier onlyOwnerOrFactoryContract() {
        if (!isOwner() && msg.sender != supplychainFactory)
            revert UserNotOwner();
        _;
    }

    modifier onlyOwnerOrTokenContract() {
        if (!isOwner() && msg.sender != governorToken) revert UserNotOwner();
        _;
    }

    modifier onlyOwnerOrFactoryOrManager(address contract_) {
        if (
            !isOwner() &&
            msg.sender != supplychainFactory &&
            members[msg.sender].managingContractAddress != contract_
        ) revert UserNotOwner();
        _;
    }

    // Functions

    //* constructor

    //* receive function

    //* fallback function (if exists)

    //* external
    function setSupplychainFactoryAddress(address addr_) external onlyOwner {
        supplychainFactory = addr_;
    }

    function setGovernorTokenAddress(address addr_) external onlyOwner {
        governorToken = addr_;
    }

    //* public
    function getManagingContractAddress(
        address addr_
    ) public view returns (address) {
        return members[addr_].managingContractAddress;
    }

    function addMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_,
        uint256 votingPower_
    ) public onlyOwnerOrTokenContract {
        _assertMemberDoesNotExist(addr_);

        Member storage member = members[addr_];
        member.addr = addr_;
        member.name = name_;
        member.infoURI = infoURI_;
        member.votingPower = votingPower_;
        member.state = ConformityState.CONFORMITY_STATE_FUNCTIONING;
    }

    function updateMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public onlyOwner {
        _assertMemberExists(addr_);

        members[addr_].name = name_;
        members[addr_].infoURI = infoURI_;
    }

    function updateMember(
        address addr_,
        address managingContractAddress_
    ) public onlyOwnerOrFactoryContract {
        _assertMemberExists(addr_);

        members[addr_].managingContractAddress = managingContractAddress_;
    }

    function updateMemberState(
        address addr_,
        ConformityState.State newState_
    ) public onlyOwner {
        ConformityState.assertValidConformityState(newState_);
        _assertMemberExists(addr_);

        members[addr_].state = newState_;
    }

    function addActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public {
        _assertActorDoesNotExist(addr_);

        Actor storage actor = actors[addr_];
        actor.addr = addr_;
        actor.name = name_;
        actor.infoURI = infoURI_;
        actor.state = ConformityState.CONFORMITY_STATE_FUNCTIONING;
    }

    function updateActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public {
        _assertActorExists(addr_);
        _assertSenderIsActor(addr_);

        actors[addr_].name = name_;
        actors[addr_].infoURI = infoURI_;
    }

    function updateActorState(
        address addr_,
        ConformityState.State newState_
    ) public onlyOwner {
        ConformityState.assertValidConformityState(newState_);
        _assertActorExists(addr_);

        actors[addr_].state = newState_;
    }

    function addContractToActor(
        address contract_,
        address actor_
    ) public onlyOwnerOrFactoryOrManager(contract_) {
        actors[actor_].participatingContracts.push(contract_);
    }

    function checkAccess(
        address contract_,
        address addr_
    ) public view returns (bool) {
        address[] memory contracts = actors[addr_].participatingContracts;
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
    function assertOpFromContractManager(
        address sender_,
        address contractAddress_
    ) public view {
        if (getManagingContractAddress(sender_) != contractAddress_)
            revert("UserCannotManageContract();");
    }

    function _assertMemberDoesNotExist(address addr_) internal view {
        if (members[addr_].addr != address(0)) revert UserAlreadyExists();
    }

    function _assertActorDoesNotExist(address addr_) internal view {
        if (actors[addr_].addr != address(0)) revert UserAlreadyExists();
    }

    function _assertMemberExists(address addr_) internal view {
        if (members[addr_].addr == address(0)) revert MemberDoesNotExist();
    }

    function _assertActorExists(address addr_) internal view {
        if (actors[addr_].addr == address(0)) revert ActorDoesNotExist();
    }

    function _assertSenderIsActor(address addr_) internal view {
        if (actors[addr_].addr != msg.sender)
            revert TransactionNotFromOriginalActorAddress();
    }
}
