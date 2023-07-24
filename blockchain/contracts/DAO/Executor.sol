// SPDX-License-Identifier: Apache-2.0
// Based on Openzeppelin Contracts (last updated v4.9.0)

pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../OpenZeppelin/utils/Address.sol";

contract Executor is Ownable {
    // Type declarations
    // State variables
    bool private locked;

    // Events

    /**
     * @dev Emitted when a call is performed as part of operation `id`.
     */
    event CallExecuted(
        bytes32 indexed id,
        uint256 indexed index,
        address target,
        uint256 value,
        bytes data
    );

    // Errors
    /**
     * @dev Prevent reentrant calls.
     */
    error ReentrantCall();

    /**
     * @dev Mismatch between the parameters length for an operation call.
     */
    error ExecutorInvalidOperationLength(
        uint256 targets,
        uint256 payloads,
        uint256 values
    );

    // Modifiers
    modifier nonReentrant() {
        if (locked) revert ReentrantCall();
        locked = true;
        _;
        locked = false;
    }

    // Functions
    //* constructor
    //* receive function
    //* fallback function (if exists)
    //* external
    //* public
    /**
     * @dev Execute an (ready) operation containing a single transaction.
     *
     * Emits a {CallExecuted} event.
     *
     * Only owner can execute, usually Governor Contract.
     */
    function execute(
        address target,
        uint256 value,
        bytes calldata payload,
        bytes32 predecessor,
        bytes32 salt
    ) public payable virtual nonReentrant onlyOwner {
        bytes32 id = hashOperation(target, value, payload, predecessor, salt);

        _execute(target, value, payload);
        emit CallExecuted(id, 0, target, value, payload);
    }

    /**
     * @dev Execute an (ready) operation containing a batch of transactions.
     *
     * Emits one {CallExecuted} event per transaction in the batch.
     *
     * Only owner can execute, usually Governor Contract.
     */
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata payloads,
        bytes32 predecessor,
        bytes32 salt
    ) public payable virtual nonReentrant onlyOwner {
        if (
            targets.length != values.length || targets.length != payloads.length
        ) {
            revert ExecutorInvalidOperationLength(
                targets.length,
                payloads.length,
                values.length
            );
        }

        bytes32 id = hashOperationBatch(
            targets,
            values,
            payloads,
            predecessor,
            salt
        );

        for (uint256 i = 0; i < targets.length; ++i) {
            address target = targets[i];
            uint256 value = values[i];
            bytes calldata payload = payloads[i];
            _execute(target, value, payload);
            emit CallExecuted(id, i, target, value, payload);
        }
    }

    /**
     * @dev Returns the identifier of an operation containing a single
     * transaction.
     */
    function hashOperation(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 predecessor,
        bytes32 salt
    ) public pure virtual returns (bytes32) {
        return keccak256(abi.encode(target, value, data, predecessor, salt));
    }

    /**
     * @dev Returns the identifier of an operation containing a batch of
     * transactions.
     */
    function hashOperationBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata payloads,
        bytes32 predecessor,
        bytes32 salt
    ) public pure virtual returns (bytes32) {
        return
            keccak256(abi.encode(targets, values, payloads, predecessor, salt));
    }

    //* internal
    /**
     * @dev Execute an operation's call.
     */
    function _execute(
        address target,
        uint256 value,
        bytes calldata data
    ) internal virtual {
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        Address.verifyCallResult(success, returndata);
    }
    //* private
    //* asserts
}
