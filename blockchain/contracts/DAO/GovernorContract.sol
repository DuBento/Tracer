// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorVotes.sol";
import "./governance/extensions/GovernorVotesQuorumFraction.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/Governor.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    constructor(
        IVotes token_,
        Executor executor_,
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 quorumFraction_
    )
        Governor("GovernorContract", executor_)
        GovernorSettings(votingDelay_, votingPeriod_, 0)
        GovernorVotes(token_)
        GovernorVotesQuorumFraction(quorumFraction_)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
