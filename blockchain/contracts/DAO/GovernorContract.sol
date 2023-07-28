// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorVotes.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/Governor.sol";
import "./IExecutor.sol";
import "./IUserRegistry.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes
{
    /** @dev Set low value during development, should be adjusted in production.
     * Possible value 51 for majority.
     */
    uint8 constant QUORUM = 25;

    constructor(
        IExecutor executor_,
        IUserRegistry userRegistry_,
        uint256 votingPeriod_
    )
        Governor("TracerDAO", executor_)
        GovernorSettings(votingPeriod_)
        GovernorVotes(userRegistry_)
    {}

    // The following functions are overrides required by Solidity.

    function quorum() public pure override returns (uint8) {
        return QUORUM;
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }
}
