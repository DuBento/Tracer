// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../ConformityState.sol";
import "../DAO/IUserRegistry.sol";
import "../OpenZeppelin/interfaces/IERC6372.sol";
import "../OpenZeppelin/utils/math/SafeCast.sol";

// import "../../node_modules/hardhat/console.sol";

contract Supplychain is Ownable, ConformityState, IERC6372 {
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
        uint48 ts; // as specified in EIP-6372
    }

    struct Transaction {
        address receiver;
        Update info;
    }

    // State variables
    mapping(uint256 => Batch) batches;

    IUserRegistry private userRegistry;

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

    // Functions

    //* constructor
    //* receive function

    //* fallback function (if exists)

    /** 
        @dev mitigate metamask node errors
    */
    fallback() external {}

    //* external

    function init(IUserRegistry userRegistry_, address owner_) external {
        if (address(userRegistry) == address(0)) {
            userRegistry = IUserRegistry(userRegistry_);
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
    ) public allowedActor {
        Batch storage batch = batches[id_];
        _assertValidUpdate(batch);
        // Send BCEvent
        // Record Update
        Update memory update = _newUpdate(documentURI_);
        batch.updates.push(update);
    }

    function handleTransaction(
        uint256 id_,
        address receiver_,
        string memory documentURI_
    ) public allowedActor {
        Batch storage batch = batches[id_];
        _assertValidUpdate(batch);
        _assertAllowedActor(receiver_);
        _assertBatchFunctioning(batch);

        Transaction memory transaction = _newTransaction(
            receiver_,
            documentURI_
        );
        batch.transactions.push(transaction);

        batch.currentOwner = receiver_;
    }

    /**
     * @dev Clock (as specified in EIP-6372) is set to timestamp.
     */
    function clock() public view virtual override returns (uint48) {
        return SafeCast.toUint48(block.timestamp);
    }

    /**
     * @dev Machine-readable description of the clock as specified in EIP-6372.
     */
    function CLOCK_MODE() public view virtual override returns (string memory) {
        return "mode=timestamp";
    }

    //* internal

    function _newUpdate(
        string memory documentURI_
    ) internal view returns (Update memory) {
        return Update(msg.sender, documentURI_, clock());
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

    function _assertValidUpdate(Batch storage batch_) private view {
        _assertBatchExists(batch_);
        _assertCurrentOwner(batch_);
    }

    function _assertCurrentOwner(Batch storage batch_) private view {
        if (batch_.currentOwner != msg.sender)
            revert UserIsNotCurrentBatchOwner();
    }

    function _assertBatchExists(Batch storage batch_) private view {
        if (batch_.id == 0) revert BatchDoesNotExist();
    }

    function _assertAllowedActor(address addr_) private view {
        // console.log("Supplychain: assertAllowedActor");
        // console.log("Supplychain: userRegistry");
        // console.logAddress(address(userRegistry));

        if (!userRegistry.checkAccess(address(this), addr_))
            revert UserNotAllowedToTransact();
    }

    function _assertBatchFunctioning(Batch storage batch_) private view {
        if (batch_.state != ConformityState.CONFORMITY_STATE_FUNCTIONING)
            revert BatchFunctioningPause();
    }
}
