// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./Common.sol";
// DEBUG only
import "hardhat/console.sol";

contract SupplyChain is Ownable {
    enum EventType {
        Create,
        Update,
        Transaction
    }

    struct Event {
        address owner;
        bytes32 documentHash;
        uint256 ts;
        EventType eventType;
    }

    struct Batch {
        uint256 id;
        string description;
        ConformityState state;
        Event[] events;
    }

    //events
    event NewBatch(address indexed owner, uint256 id);

    mapping(uint256 => Batch) batches;

    function getBatch(uint256 id_) public view returns (Batch memory) {
        return batches[id_];
    }

    function ping() public pure returns (string memory) {
        return "pong";
    }

    function newBatch(
        string memory description_,
        bytes32 documentHash_
    ) public returns (uint256) {
        uint256 batchId = generateId();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = description_;
        batch.state = ConformityState.Functioning;

        console.log("batchId:", batchId);

        // handle create event
        Event memory newEvent = Event(
            msg.sender,
            documentHash_,
            block.timestamp,
            EventType.Create
        );
        handleEvent(batchId, newEvent);

        emit NewBatch(msg.sender, batch.id);

        return batchId;
    }

    function handleEvent(uint256 id_, Event memory event_) public {
        // Asserts (modifier)
        assertEventOwner(event_, msg.sender);
        assertBacthExists(id_);
        assertEventValidTimestamp(id_, event_);
        // Send BCEvent
        // Record Event
        batches[id_].events.push(event_);

        console.log("Event pushed successfully in id: ");
        console.log(id_);
        console.log(", event: ");
        console.log(event_.owner);
        // console.log(event_.documentHash);
        console.log(event_.ts);
        console.log(uint8(event_.eventType));
    }

    function getLastEvent(uint256 id_) private view returns (Event storage) {
        Event[] storage events = batches[id_].events;
        uint256 arrayLen = events.length;
        require(arrayLen > 0, "Accessing empty array");

        return events[arrayLen - 1];
    }

    function generateId() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        msg.sender,
                        block.timestamp,
                        block.difficulty
                    )
                )
            );
    }

    // Asserts

    function assertEventOwner(
        Event memory event_,
        address sender_
    ) private pure {
        require(
            event_.owner == sender_,
            "Event owner differs from message sender"
        );
    }

    function assertBacthExists(uint256 id_) private view {
        require(batches[id_].id != 0, "Address for nonexistent batch");
    }

    function assertEventValidTimestamp(
        uint256 id_,
        Event memory event_
    ) private view {
        Event[] storage events = batches[id_].events;
        require(
            (((events.length > 0 && getLastEvent(id_).ts < event_.ts)) ||
                events.length == 0) && event_.ts <= block.timestamp,
            "Invalid event timestamp"
        );
    }

    // @developement mitigate metamask node errors
    fallback() external {}
}
