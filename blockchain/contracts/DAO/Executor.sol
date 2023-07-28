// SPDX-License-Identifier: Apache-2.0
// Based on Openzeppelin Contracts (last updated v4.9.0)

pragma solidity ^0.8.19;

import "../custom/Ownable.sol";
import "../OpenZeppelin/utils/Address.sol";
import "./IExecutor.sol";

contract Executor is IExecutor, Ownable {
    // Type declarations
    // State variables
    bool private locked;

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
    /**
     * @dev Contract might receive/hold ETH as part of the maintenance process.
     */
    receive() external payable override {}

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
    ) public payable override nonReentrant onlyOwner {
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
    ) public payable override nonReentrant onlyOwner {
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

    //* internal
    /**
     * @dev Execute an operation's call.
     */
    function _execute(
        address target,
        uint256 value,
        bytes calldata data
    ) internal {
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        Address.verifyCallResult(success, returndata);
    }
    //* private
    //* asserts
}
