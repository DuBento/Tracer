// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./Common.sol";
// DEBUG only
import "hardhat/console.sol";

contract SupplyChain is Ownable {
    struct Batch {
        uint256 id;
        string description;
        address currentOwner;
        ConformityState state;
        Update[] updates;
        Transaction[] transactions;
    }

    struct Update {
        address owner;
        bytes32 documentHash;
        uint256 ts;
    }

    struct Transaction {
        address receiver;
        Update info;
    }

    mapping(uint256 => Batch) batches;

    //events
    event NewBatch(address indexed owner, uint256 id);

    function getBatch(uint256 id_) public view returns (Batch memory) {
        return batches[id_];
    }

    function newBatch(
        string memory description_,
        bytes32 documentHash_
    ) public returns (uint256) {
        uint256 batchId = generateId();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = description_;
        batch.currentOwner = msg.sender;
        batch.state = ConformityState.Functioning;

        // handle create transaction
        Transaction memory newTransaction = Transaction(
            msg.sender,
            Update(msg.sender, documentHash_, block.timestamp)
        );
        batch.transactions.push(newTransaction);

        emit NewBatch(msg.sender, batch.id);
        console.log("batchId:", batchId);

        return batchId;
    }

    function handleUpdate(
        uint256 id_,
        Update memory update_
    ) public isValidUpdate(id_, update_) {
        // Send BCEvent
        // Record Update
        batches[id_].updates.push(update_);

        console.log("Event pushed successfully in id: ");
        console.log(id_);
    }

    function handleTransaction(
        uint256 id_,
        Transaction memory transaction_
    ) public isValidUpdate(id_, transaction_.info) {
        Batch storage batch = batches[id_];
        batch.currentOwner = transaction_.receiver;
        batch.transactions.push(transaction_);
    }

    function getLastElement(
        Update[] storage updates
    ) private view returns (Update storage) {
        uint256 arrayLen = updates.length;
        require(arrayLen > 0, "Accessing empty array");

        return updates[arrayLen - 1];
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

    // Admin

    function changeConformityState(
        ConformityState newState_
    ) external onlyOwner {
        // TODO
    }

    // Asserts

    modifier isValidUpdate(uint256 id_, Update memory update_) {
        assertUpdateOwner(update_);
        assertBatchExists(id_);
        assertCurrentOwner(id_, update_);
        assertValidUpdateTimestamp(id_, update_);
        _;
    }

    function assertUpdateOwner(Update memory update_) private view {
        require(
            update_.owner == msg.sender,
            "Update owner differs from message sender"
        );
    }

    function assertCurrentOwner(
        uint256 id_,
        Update memory update_
    ) private view {
        require(
            batches[id_].currentOwner == update_.owner,
            "Trying to update batch while not being the current owner"
        );
    }

    function assertBatchExists(uint256 id_) private view {
        require(batches[id_].id != 0, "Address for nonexistent batch");
    }

    function assertValidUpdateTimestamp(
        uint256 id_,
        Update memory update_
    ) private view {
        Update[] storage updates = batches[id_].updates;
        require(
            update_.ts <= block.timestamp &&
                ((updates.length > 0 &&
                    getLastElement(updates).ts < update_.ts) ||
                    updates.length == 0),
            "Invalid event timestamp"
        );
    }

    // @developement mitigate metamask node errors
    fallback() external {}
}
