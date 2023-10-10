// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../ConformityState.sol";
import "../DAO/IUserRegistry.sol";
import "../OpenZeppelin/interfaces/IERC6372.sol";
import "../OpenZeppelin/utils/math/SafeCast.sol";

contract Traceability is Ownable, ConformityState, IERC6372 {
    // Type declarations
    struct Batch {
        uint256 id;
        address currentOwner;
        ConformityState.State state;
        string description;
        Transaction[] transactions;
    }

    struct Transaction {
        address receiver;
        string[] additionalAttributesValues;
    }

    // State variables
    mapping(uint256 => Batch) batches;

    IUserRegistry private userRegistry;
    address private manager;
    string private contractDescription;

    string[] private requiredTransactionAttributesKeys;

    // Events
    event NewBatch(address indexed owner, uint256 id);
    event Update(
        uint256 indexed batchId,
        address indexed owner,
        uint48 ts,
        string documentURI
    ); // ts: as specified in EIP-6372

    // Errors
    error UserIsNotCurrentBatchOwner();
    error BatchDoesNotExist();
    error UserNotAllowedToTransact();
    error BatchFunctioningPause();
    error InvalidAdditionalUpdateAttributes();

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

    function init(
        IUserRegistry userRegistry_,
        address owner_,
        address manager_,
        string calldata contractDescription_,
        string[] memory requiredTransactionAttributesKeys_
    ) external {
        if (address(userRegistry) == address(0)) {
            // init can only be called once
            userRegistry = IUserRegistry(userRegistry_);
            manager = manager_;
            contractDescription = contractDescription_;
            requiredTransactionAttributesKeys = requiredTransactionAttributesKeys_;

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

    function getManager() public view returns (address) {
        return manager;
    }

    function getContractDescription() public view returns (string memory) {
        return contractDescription;
    }

    function getRequiredTransactionAttributesKeys()
        public
        view
        returns (string[] memory)
    {
        return requiredTransactionAttributesKeys;
    }

    function getBatch(uint256 id_) public view returns (Batch memory) {
        return batches[id_];
    }

    function newBatch(
        string memory description_,
        string memory documentURI_
    ) public allowedActor returns (uint256) {
        uint256 batchId = _generateId();
        Batch storage batch = batches[batchId];
        batch.id = batchId;
        batch.description = description_;
        batch.currentOwner = msg.sender;
        batch.state = ConformityState.CONFORMITY_STATE_FUNCTIONING;

        // handle create transaction
        Transaction memory transaction = _newTransaction(
            batchId,
            msg.sender,
            documentURI_,
            new string[](0)
        );
        batch.transactions.push(transaction);

        emit NewBatch(msg.sender, batch.id);

        return batchId;
    }

    function handleTransaction(
        uint256 id_,
        address receiver_,
        string memory documentURI_,
        string[] memory additionalAttributesValues_
    ) public allowedActor {
        // allowed actor could be removed and only check if its the same as the current batch owner, but kept for clarity
        Batch storage batch = batches[id_];
        _assertValidUpdate(batch);
        _assertAllowedActor(receiver_);
        _assertBatchFunctioning(batch);
        _assertValidAdditionalAttributes(additionalAttributesValues_);

        Transaction memory transaction = _newTransaction(
            id_,
            receiver_,
            documentURI_,
            additionalAttributesValues_
        );
        batch.transactions.push(transaction);

        batch.currentOwner = receiver_;
    }

    function handleUpdate(
        uint256 id_,
        string memory documentURI_
    ) public allowedActor {
        Batch storage batch = batches[id_];
        _assertValidUpdate(batch);

        _newUpdate(id_, documentURI_);
    }

    /**
     * @dev Clock (as specified in EIP-6372) is set to timestamp.
     */
    function clock() public view virtual override returns (uint256) {
        return block.timestamp;
    }

    /**
     * @dev Machine-readable description of the clock as specified in EIP-6372.
     */
    function CLOCK_MODE() public view virtual override returns (string memory) {
        return "mode=timestamp";
    }

    //* internal

    /**
     * The first update from an actor is the update related to the transaction.
     * Defined implicitly to save gas.
     */
    function _newTransaction(
        uint256 id_,
        address receiver_,
        string memory documentURI_,
        string[] memory additionalAttributesValues_
    ) internal returns (Transaction memory) {
        _newUpdate(id_, documentURI_);
        return Transaction(receiver_, additionalAttributesValues_);
    }

    function _newUpdate(uint256 id_, string memory documentURI_) internal {
        emit Update(id_, msg.sender, SafeCast.toUint48(clock()), documentURI_);
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
        if (!userRegistry.checkAccess(address(this), addr_))
            revert UserNotAllowedToTransact();
    }

    function _assertBatchFunctioning(Batch storage batch_) private view {
        if (batch_.state != ConformityState.CONFORMITY_STATE_FUNCTIONING)
            revert BatchFunctioningPause();
    }

    function _assertValidAdditionalAttributes(
        string[] memory additionalAttributesValues_
    ) private view {
        if (
            additionalAttributesValues_.length !=
            requiredTransactionAttributesKeys.length
        ) revert InvalidAdditionalUpdateAttributes();
    }
}
