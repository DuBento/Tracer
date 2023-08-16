// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../ConformityState.sol";
import "./IUserRegistry.sol";

contract UserRegistry is IUserRegistry, Ownable, ConformityState {
    // State variables
    uint256 public memberCount;
    address private supplychainFactory;

    mapping(address => Member) members;
    mapping(address => Actor) actors;

    // Modifiers
    modifier onlyOwnerOrFactoryContract() {
        if (!isOwner() && msg.sender != supplychainFactory)
            revert UserNotOwner();
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
    function setSupplychainFactoryAddress(
        address addr_
    ) external override onlyOwner {
        supplychainFactory = addr_;
    }

    //* public
    function getMember(
        address addr_
    ) public view override returns (Member memory) {
        return members[addr_];
    }

    function getActor(
        address addr_
    ) public view override returns (Actor memory) {
        return actors[addr_];
    }

    function getVotes(address member_) public view override returns (uint8) {
        return members[member_].votingPower;
    }

    function getManagingContractAddress(
        address addr_
    ) public view override returns (address) {
        return members[addr_].managingContractAddress;
    }

    function addMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_,
        uint8 votingPower_
    ) public override onlyOwner {
        _assertMemberDoesNotExist(addr_);
        _assertValidVotingPower(votingPower_);

        memberCount++;

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
    ) public override onlyOwner {
        Member storage member = members[addr_];
        _assertMemberExists(member);

        member.name = name_;
        member.infoURI = infoURI_;
    }

    function updateMember(
        address addr_,
        address managingContractAddress_
    ) public override onlyOwnerOrFactoryContract {
        Member storage member = members[addr_];
        _assertMemberExists(member);

        member.managingContractAddress = managingContractAddress_;
    }

    function updateMemberState(
        address addr_,
        ConformityState.State newState_
    ) public override onlyOwner {
        Member storage member = members[addr_];
        ConformityState.assertValidConformityState(newState_);
        _assertMemberExists(member);

        member.state = newState_;
    }

    function addActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public override {
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
    ) public override {
        Actor storage actor = actors[addr_];
        _assertActorExists(actor);
        _assertSenderIsActor(actor);

        actor.name = name_;
        actor.infoURI = infoURI_;
    }

    function updateActorState(
        address addr_,
        ConformityState.State newState_
    ) public override onlyOwner {
        Actor storage actor = actors[addr_];
        ConformityState.assertValidConformityState(newState_);
        _assertActorExists(actor);

        actor.state = newState_;
    }

    function addContractToActor(
        address contract_,
        address actor_
    ) public override onlyOwnerOrFactoryOrManager(contract_) {
        actors[actor_].participatingContracts.push(contract_);
    }

    function checkAccess(
        address contract_,
        address addr_
    ) public view override returns (bool) {
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

    function _assertMemberExists(Member storage member_) internal view {
        if (member_.addr == address(0)) revert MemberDoesNotExist();
    }

    function _assertActorExists(Actor storage actor_) internal view {
        if (actor_.addr == address(0)) revert ActorDoesNotExist();
    }

    function _assertSenderIsActor(Actor storage actor_) internal view {
        if (actor_.addr != msg.sender)
            revert TransactionNotFromOriginalActorAddress();
    }

    function _assertValidVotingPower(uint8 votingPower_) internal pure {
        if (votingPower_ > MAX_VOTING_POWER)
            revert InvalidVotingPower(votingPower_);
    }
}
