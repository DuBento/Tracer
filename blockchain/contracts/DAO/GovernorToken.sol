// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../OpenZeppelin/token/ERC20/ERC20.sol";
import "../OpenZeppelin/token/ERC20/extensions/ERC20Permit.sol";
import "../OpenZeppelin/token/ERC20/extensions/ERC20Votes.sol";

contract GovernorToken is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("GovernorToken", "GTK") ERC20Permit("GovernorToken") {}

    // The functions below are overrides required by Solidity.

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }
}