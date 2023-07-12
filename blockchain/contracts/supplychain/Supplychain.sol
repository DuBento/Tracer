// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../ConformityState.sol";
import "../DAO/UserRegistry.sol";

// import "../../node_modules/hardhat/console.sol";

contract Supplychain is Ownable, ConformityState {
    // Type declarations
    struct Batch {
        uint256 id;
        string description;
        address currentOwner;
        ConformityState.State state;
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

    // State variables
    mapping(uint256 => Batch) batches;

    UserRegistry private userRegistry;

    // Events
    event NewBatch(address indexed owner, uint256 id);

    // Errors
    error UserIsNotCurrentBatchOwner();
    error BatchDoesNotExist();
    error UserNotAllowedToTransact();
    error BatchFunctioningPause();

    // Modifiers
    modifier allowedActor() {
        _assertAllowedActor(msg.sender);
        _;
    }

    modifier isValidUpdate(uint256 id_) {
        _assertBatchExists(id_);
        _assertCurrentOwner(id_);
        _;
    }

    modifier onlyFunctioningBatch(uint256 id_) {
        _assertBatchFunctioning(id_);
        _;
    }

    // Functions

    //* constructor
    //* receive function

    //* fallback function (if exists)

    /** 
        @dev mitigate metamask node errors
    */
    fallback() external {}

    //* external

    function init(UserRegistry userRegistry_, address owner_) external {
        if (address(userRegistry) == address(0)) {
            userRegistry = UserRegistry(userRegistry_);
            super.init(owner_);
        }
    }

    function changeConformityState(
        uint256 batchId_,
        ConformityState.State newState_
    ) external onlyOwner {
        ConformityState.assertValidConformityState(newState_);

        batches[batchId_].state = newState_;
    }

    //* public

    function getBatch(uint256 id_) public view returns (Batch memory) {
        return batches[id_];
    }

    function newBatch(
        string memory description_
    ) public allowedActor returns (uint256) {
        uint256 batchId = _generateId();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = description_;
        batch.currentOwner = msg.sender;
        batch.state = ConformityState.CONFORMITY_STATE_FUNCTIONING;

        // handle create transaction
        Transaction memory transaction = _newTransaction(msg.sender, "");
        batch.transactions.push(transaction);

        emit NewBatch(msg.sender, batch.id);

        return batchId;
    }

    function handleUpdate(
        uint256 id_,
        string memory documentURI_
    ) public allowedActor isValidUpdate(id_) {
        // Send BCEvent
        // Record Update
        Update memory update = _newUpdate(documentURI_);
        batches[id_].updates.push(update);
    }

    function handleTransaction(
        uint256 id_,
        address receiver_,
        string memory documentURI_
    ) public allowedActor onlyFunctioningBatch(id_) isValidUpdate(id_) {
        _assertAllowedActor(receiver_);

        Batch storage batch = batches[id_];

        Transaction memory transaction = _newTransaction(
            receiver_,
            documentURI_
        );
        batch.transactions.push(transaction);

        batch.currentOwner = receiver_;
    }

    //* internal

    function _newUpdate(
        string memory documentURI_
    ) internal view returns (Update memory) {
        return Update(msg.sender, documentURI_, block.timestamp);
    }

    function _newTransaction(
        address receiver_,
        string memory documentURI_
    ) internal view returns (Transaction memory) {
        return Transaction(receiver_, _newUpdate(documentURI_));
    }

    //* private

    function _generateId() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(msg.sender, block.timestamp, block.prevrandao)
                )
            );
    }

    //* asserts

    function _assertCurrentOwner(uint256 id_) private view {
        if (batches[id_].currentOwner != msg.sender)
            revert UserIsNotCurrentBatchOwner();
    }

    function _assertBatchExists(uint256 id_) private view {
        if (batches[id_].id == 0) revert BatchDoesNotExist();
    }

    function _assertAllowedActor(address addr_) private view {
        // console.log("Supplychain: assertAllowedActor");
        // console.log("Supplychain: userRegistry");
        // console.logAddress(address(userRegistry));

        if (!userRegistry.checkAccess(address(this), addr_))
            revert UserNotAllowedToTransact();
    }

    function _assertBatchFunctioning(uint256 id_) private view {
        if (batches[id_].state != ConformityState.CONFORMITY_STATE_FUNCTIONING)
            revert BatchFunctioningPause();
    }
}
