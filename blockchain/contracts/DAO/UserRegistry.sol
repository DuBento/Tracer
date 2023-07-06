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
    }

    // State variables
    mapping(address => Member) members;
    mapping(address => Actor) actors;

    // Events

    // Errors
    error UserAlreadyExists();
    error UserDoesNotExist();

    // Modifiers

    // Functions

    //* constructor

    //* receive function

    //* fallback function (if exists)

    //* external

    //* public

    function addMember(
        address addr_,
        string calldata name_,
        string calldata infoURI_,
        uint256 votingPower_
    ) public onlyOwner {
        _assertMemberDoesNotExist(addr_);

        Member memory member = Member(
            addr_,
            name_,
            infoURI_,
            votingPower_,
            ConformityState.CONFORMITY_STATE_FUNCTIONING,
            address(0)
        );
        members[addr_] = member;
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
    ) public onlyOwner {
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
    ) public onlyOwner {
        _assertActorDoesNotExist(addr_);

        Actor memory actor = Actor(
            addr_,
            name_,
            infoURI_,
            ConformityState.CONFORMITY_STATE_FUNCTIONING
        );
        actors[addr_] = actor;
    }

    function updateActor(
        address addr_,
        string calldata name_,
        string calldata infoURI_
    ) public onlyOwner {
        _assertActorExists(addr_);

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

    //* internal

    //* private

    //* asserts
    function _assertMemberDoesNotExist(address addr_) internal view {
        if (members[addr_].addr != address(0)) revert UserAlreadyExists();
    }

    function _assertActorDoesNotExist(address addr_) internal view {
        if (actors[addr_].addr != address(0)) revert UserAlreadyExists();
    }

    function _assertMemberExists(address addr_) internal view {
        if (members[addr_].addr == address(0)) revert UserDoesNotExist();
    }

    function _assertActorExists(address addr_) internal view {
        if (actors[addr_].addr == address(0)) revert UserDoesNotExist();
    }
}
