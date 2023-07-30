// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (governance/extensions/GovernorVotes.sol)

pragma solidity ^0.8.19;

import "../Governor.sol";
import "../../IUserRegistry.sol";

/**
 * @dev Extension of {Governor} for voting weight extraction from an {ERC20Votes} token, or since v4.5 an {ERC721Votes} token.
 *
 * _Available since v4.3._
 */
abstract contract GovernorVotes is Governor {
    IUserRegistry public userRegistry;

    event UserRegistryUpdated(
        IUserRegistry oldUserRegistry,
        IUserRegistry newUserRegistry
    );

    constructor(IUserRegistry userRegistryAddress) {
        userRegistry = userRegistryAddress;
    }

    /**
     * @dev Clock (as specified in EIP-6372) is set to timestamp..
     */
    function clock() public view virtual override returns (uint48) {
        return SafeCast.toUint48(block.timestamp);
    }

    /**
     * @dev Machine-readable description of the clock as specified in EIP-6372.
     */
    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public view virtual override returns (string memory) {
        return "mode=timestamp";
    }

    /**
     * @dev Read the voting weight from the User Registry (see {Governor-_getVotes}).
     */
    function _getVotes(
        address account
    ) internal view virtual override returns (uint8) {
        return userRegistry.getVotes(account);
    }

    /**
     * @dev Update the user registry address.
     *
     * Emits a {UserRegistryUpdated} event.
     */
    function _setUserRegistry(
        IUserRegistry newUserRegistryAddress
    ) internal virtual onlyGovernance {
        emit UserRegistryUpdated(userRegistry, newUserRegistryAddress);
        userRegistry = newUserRegistryAddress;
    }
}
