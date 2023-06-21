// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

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
        string documentURI;
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

    function newBatch(string memory description_) public returns (uint256) {
        uint256 batchId = generateId();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = description_;
        batch.currentOwner = msg.sender;
        batch.state = ConformityState.Functioning;

        // handle create transaction
        Transaction memory transaction = newTransaction(msg.sender, "");
        batch.transactions.push(transaction);

        emit NewBatch(msg.sender, batch.id);
        console.log("batchId:", batchId);

        return batchId;
    }

    function handleUpdate(
        uint256 id_,
        string memory documentURI_
    ) public isValidUpdate(id_) {
        // Send BCEvent
        // Record Update
        Update memory update = newUpdate(documentURI_);
        batches[id_].updates.push(update);

        console.log("Event pushed successfully in id: ");
        console.log(id_);
    }

    function handleTransaction(
        uint256 id_,
        address receiver_,
        string memory documentURI_
    ) public isValidUpdate(id_) {
        Batch storage batch = batches[id_];

        Transaction memory transaction = newTransaction(
            receiver_,
            documentURI_
        );
        batch.transactions.push(transaction);

        batch.currentOwner = receiver_;
        // TODO: check if receiver in DAO?
    }

    function newUpdate(
        string memory documentURI_
    ) internal view returns (Update memory) {
        return Update(msg.sender, documentURI_, block.timestamp);
    }

    function newTransaction(
        address receiver_,
        string memory documentURI_
    ) internal view returns (Transaction memory) {
        return Transaction(receiver_, newUpdate(documentURI_));
    }

    function getLastElement(
        Update[] storage updates_
    ) private view returns (Update storage) {
        uint256 arrayLen = updates_.length;
        require(arrayLen > 0, "Accessing empty array");

        return updates_[arrayLen - 1];
    }

    function getLastElement(
        Transaction[] storage transactions_
    ) private view returns (Transaction storage) {
        uint256 arrayLen = transactions_.length;
        require(arrayLen > 0, "Accessing empty array");

        return transactions_[arrayLen - 1];
    }

    function generateId() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        msg.sender,
                        block.timestamp,
                        block.prevrandao
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

    modifier isValidUpdate(uint256 id_) {
        // assertUpdateOwner(update_);
        assertBatchExists(id_);
        assertCurrentOwner(id_);
        // assertValidUpdateTimestamp(id_, update_);
        _;
    }

    function assertUpdateOwner(Update memory update_) private view {
        require(
            update_.owner == msg.sender,
            "Update owner differs from message sender"
        );
    }

    function assertCurrentOwner(uint256 id_) private view {
        require(
            batches[id_].currentOwner == msg.sender,
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
        Transaction[] storage transactions = batches[id_].transactions;
        require(
            update_.ts <= block.timestamp &&
                ((updates.length > 0 &&
                    getLastElement(updates).ts < update_.ts) ||
                    (transactions.length > 0 &&
                        getLastElement(transactions).info.ts < update_.ts)),
            "Invalid update timestamp"
        );
    }

    // @developement mitigate metamask node errors
    fallback() external {}
}
