// SPDX-License-Identifier: Apache-2.0
// Based on Openzeppelin Contracts (last updated v4.9.0)

pragma solidity ^0.8.19;

import "../../IExecutor.sol";

/**
 * @dev Extension of {Governor} that binds the execution process to an instance of {Executer}.
 *
 * Using this model means the proposal will be operated by the {Executor} and not by the {Governor}. Thus,
 * the assets and permissions must be attached to the {Executor}
 */
abstract contract GovernorExecutor {
    IExecutor private _executorContract;

    // Type declarations
    // State variables
    // Events
    /**
     * @dev Emitted when the executor used for proposal execution is modified.
     */
    event ExecutorChange(address oldExecutor, address newExecutor);

    // Errors
    // Modifiers
    // Functions
    //* constructor

    /**
     * @dev Set the executor.
     */
    constructor(IExecutor executorAddress) {
        _executorContract = executorAddress;
    }

    //* receive function
    //* fallback function (if exists)
    //* external
    //* public
    //* internal

    /**
     * @dev Address through which the governor executes action. In this case, the timelock.
     */
    function _executor() internal view virtual returns (address) {
        return address(_executorContract);
    }

    /**
     * @dev Execute function that run the ready proposal through the executor.
     */
    function _execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual {
        // execute
        _executorContract.executeBatch{value: msg.value}(
            targets,
            values,
            calldatas,
            0,
            descriptionHash
        );
    }

    /**
     * @dev Update executor contract address.
     */
    function _updateExecutor(IExecutor newExecutor) internal {
        emit ExecutorChange(address(_executorContract), address(newExecutor));
        _executorContract = newExecutor;
    }

    //* private
    //* asserts
}
