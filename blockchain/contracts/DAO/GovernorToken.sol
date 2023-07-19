// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "../OpenZeppelin/token/ERC20/ERC20.sol";
import "../OpenZeppelin/token/ERC20/extensions/ERC20Permit.sol";
import "../OpenZeppelin/token/ERC20/extensions/ERC20Votes.sol";
import "../custom/Ownable.sol";
import "./UserRegistry.sol";

contract GovernorToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() ERC20("GovernorToken", "GTK") ERC20Permit("GovernorToken") {
        _mint(msg.sender, 1);
    }

    function addMember(
        UserRegistry userRegistry_,
        address member_,
        string calldata name_,
        string calldata infoURI_,
        uint256 votingPower_
    ) external onlyOwner {
        _mint(member_, votingPower_);
        _delegate(member_, member_);
        userRegistry_.addMember(member_, name_, infoURI_, votingPower_);
    }

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
