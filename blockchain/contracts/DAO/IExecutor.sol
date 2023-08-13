// SPDX-License-Identifier: Apache-2.0
// Based on Openzeppelin Contracts (last updated v4.9.0)

pragma solidity ^0.8.19;

abstract contract IExecutor {
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

    /**
     * @dev Contract might receive/hold ETH as part of the maintenance process.
     */
    receive() external payable virtual;

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
        bytes32 salt
    ) public payable virtual;

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
        bytes32 salt
    ) public payable virtual;

    /**
     * @dev Returns the identifier of an operation containing a single
     * transaction.
     */
    function hashOperation(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 salt
    ) public pure virtual returns (bytes32) {
        return keccak256(abi.encode(target, value, data, salt));
    }

    /**
     * @dev Returns the identifier of an operation containing a batch of
     * transactions.
     */
    function hashOperationBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata payloads,
        bytes32 salt
    ) public pure virtual returns (bytes32) {
        return keccak256(abi.encode(targets, values, payloads, salt));
    }
}
