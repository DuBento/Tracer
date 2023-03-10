// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./Common.sol";

contract SupplyChain {
    enum EventType {
        Update,
        Transaction
    }

    struct Event {
        address owner;
        Hash documentHash;
        Timestamp ts;
        EventType eventType;
    }

    struct Batch {
        address id;
        string description;
        ConformityState state;
        Event[] events;
    }

    address public owner;
    mapping(address => Batch) public batches;

    constructor() {
        owner = msg.sender;
    }
}
