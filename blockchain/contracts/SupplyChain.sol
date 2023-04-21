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
        Hash documentHash;
        uint256 ts;
        EventType eventType;
    }

    struct Batch {
        address id;
        string description;
        ConformityState state;
        Event[] events;
    }

    mapping(address => Batch) public batches;

    function newBatch(
        string memory _description,
        Hash _documentHash
    ) public returns (address) {
        address batchId = generateAddress();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = _description;
        batch.state = ConformityState.Functioning;

        console.log("batchId:", batchId);

        // handle create event
        Event memory newEvent = Event(
            msg.sender,
            _documentHash,
            block.timestamp,
            EventType.Create
        );
        handleEvent(batchId, newEvent);

        return batchId;
    }

    function handleEvent(address _address, Event memory _event) public {
        // Asserts (modifier)
        assertEventOwner(_event, msg.sender);
        assertBacthExists(_address);
        assertEventValidTimestamp(_address, _event);
        // Send BCEvent
        // Record Event
        batches[_address].events.push(_event);
    }

    function getLastEvent(
        address _address
    ) private view returns (Event storage) {
        Event[] storage events = batches[_address].events;
        uint256 arrayLen = events.length;
        require(arrayLen > 0, "Accessing empty array");

        return events[arrayLen - 1];
    }

    function generateAddress() public view returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                msg.sender,
                                block.timestamp,
                                block.difficulty
                            )
                        )
                    )
                )
            );
    }

    // Asserts

    function assertEventOwner(
        Event memory _event,
        address _sender
    ) private pure {
        require(
            _event.owner == _sender,
            "Event owner differs from message sender"
        );
    }

    function assertBacthExists(address _address) private view {
        require(
            batches[_address].id != address(0),
            "Address for nonexistent batch"
        );
    }

    function assertEventValidTimestamp(
        address _address,
        Event memory _event
    ) private view {
        Event[] storage events = batches[_address].events;
        require(
            (((events.length > 0 && getLastEvent(_address).ts < _event.ts)) ||
                events.length == 0) && _event.ts <= block.timestamp,
            "Invalid event timestamp"
        );
    }
}
