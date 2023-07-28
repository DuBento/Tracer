// SPDX-License-Identifier: Apache-2.0
// Based on Openzeppelin Contracts (last updated v4.9.1)

pragma solidity ^0.8.19;

import "../../OpenZeppelin/token/ERC721/IERC721Receiver.sol";
import "../../OpenZeppelin/token/ERC1155/IERC1155Receiver.sol";
import "../../OpenZeppelin/utils/cryptography/ECDSA.sol";
import "../../OpenZeppelin/utils/cryptography/EIP712.sol";
import "../../OpenZeppelin/utils/introspection/ERC165.sol";
import "../../OpenZeppelin/utils/math/SafeCast.sol";
import "../../OpenZeppelin/utils/Address.sol";
import "./extensions/GovernorExecutor.sol";
import "./IGovernor.sol";

/**
 * @dev Core of the governance system, designed to be extended though various modules.
 *
 * This contract is abstract and requires several functions to be implemented in various modules:
 *
 * - A counting module must implement {quorum}, {_quorumReached}, {_voteSucceeded} and {_countVote}
 * - A voting module must implement {_getVotes}
 * - Additionally, {votingPeriod} must also be implemented
 *
 * Modified version of governance contracts from OpenZeppelin v4.9.1
 */
abstract contract Governor is
    GovernorExecutor,
    ERC165,
    EIP712,
    IGovernor,
    IERC721Receiver,
    IERC1155Receiver
{
    bytes32 public constant BALLOT_TYPEHASH =
        keccak256("Ballot(uint256 proposalId,uint8 support)");
    bytes32 public constant EXTENDED_BALLOT_TYPEHASH =
        keccak256(
            "ExtendedBallot(uint256 proposalId,uint8 support,string reason,bytes params)"
        );

    struct ProposalCore {
        uint64 voteStart;
        address proposer;
        uint64 voteEnd;
        bool executed;
        bool canceled;
    }
    // solhint-enable var-name-mixedcase

    bytes32 private constant _ALL_PROPOSAL_STATES_BITMAP =
        bytes32((2 ** (uint8(type(ProposalState).max) + 1)) - 1);
    string private _name;

    /// @custom:oz-retyped-from mapping(uint256 => Governor.ProposalCore)
    mapping(uint256 => ProposalCore) private _proposals;

    /**
     * @dev Restricts a function so it can only be executed through governance proposals. For example, governance
     * parameter setters in {GovernorSettings} are protected using this modifier.
     *
     * The governance executing address may be different from the Governor's own address, for example it could be a
     * timelock. This can be customized by modules by overriding {_executor}. The executor is only able to invoke these
     * functions during the execution of the governor's {execute} function, and not under any other circumstances. Thus,
     * for example, additional timelock proposers are not able to change governance parameters without going through the
     * governance protocol (since v4.6).
     */
    modifier onlyGovernance() {
        if (_executor() != msg.sender) {
            revert GovernorOnlyExecutor(msg.sender);
        }
        _;
    }

    /**
     * @dev Sets the value for {name} and {version}
     */
    constructor(
        string memory name_,
        IExecutor executor_
    ) EIP712(name_, version()) GovernorExecutor(executor_) {
        _name = name_;
    }

    /**
     * @dev Function to receive ETH that will be handled by the governor (disabled if executor is a third party contract)
     */
    receive() external payable virtual {
        if (_executor() != address(this)) {
            revert GovernorDisabledDeposit();
        }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(IERC165, ERC165) returns (bool) {
        bytes4 governorCancelId = this.cancel.selector ^
            this.proposalProposer.selector;

        // The original interface id in v4.3.
        bytes4 governor43Id = type(IGovernor).interfaceId ^
            type(IERC6372).interfaceId ^
            governorCancelId;

        // An updated interface id in v4.6, with params added.
        bytes4 governor46Id = type(IGovernor).interfaceId ^
            type(IERC6372).interfaceId ^
            governorCancelId;

        // For the updated interface id in v4.9, we use governorCancelId directly.

        return
            interfaceId == governor43Id ||
            interfaceId == governor46Id ||
            interfaceId == governorCancelId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IGovernor-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IGovernor-version}.
     */
    function version() public view virtual override returns (string memory) {
        return "1";
    }

    /**
     * @dev See {IGovernor-hashProposal}.
     *
     * The proposal id is produced by hashing the ABI encoded `targets` array, the `values` array, the `calldatas` array
     * and the descriptionHash (bytes32 which itself is the keccak256 hash of the description string). This proposal id
     * can be produced from the proposal data which is part of the {ProposalCreated} event. It can even be computed in
     * advance, before the proposal is submitted.
     *
     * Note that the chainId and the governor address are not part of the proposal id computation. Consequently, the
     * same proposal (with same operation and same description) will have the same id if submitted on multiple governors
     * across multiple networks. This also means that in order to execute the same operation twice (on the same
     * governor) the proposer will have to change the description in order to avoid proposal id conflicts.
     */
    function hashProposal(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public pure virtual override returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(targets, values, calldatas, descriptionHash)
                )
            );
    }

    /**
     * @dev See {IGovernor-state}.
     */
    function state(
        uint256 proposalId
    ) public view virtual override returns (ProposalState) {
        ProposalCore storage proposal = _proposals[proposalId];

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        if (proposal.canceled) {
            return ProposalState.Canceled;
        }

        uint256 snapshot = proposalSnapshot(proposalId);

        if (snapshot == 0) {
            revert GovernorNonexistentProposal(proposalId);
        }

        uint256 currentTimepoint = clock();
        uint256 deadline = proposalDeadline(proposalId);

        if (deadline < currentTimepoint) {
            return ProposalState.Expired;
        }

        if (_quorumReached(proposalId)) {
            if (_voteSucceeded(proposalId)) {
                return ProposalState.Succeeded;
            } else {
                return ProposalState.Defeated;
            }
        } else {
            return ProposalState.Active;
        }
    }

    /**
     * @dev See {IGovernor-proposalSnapshot}.
     */
    function proposalSnapshot(
        uint256 proposalId
    ) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteStart;
    }

    /**
     * @dev See {IGovernor-proposalDeadline}.
     */
    function proposalDeadline(
        uint256 proposalId
    ) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteEnd;
    }

    /**
     * @dev Returns the account that created a given proposal.
     */
    function proposalProposer(
        uint256 proposalId
    ) public view virtual override returns (address) {
        return _proposals[proposalId].proposer;
    }

    /**
     * @dev Amount of votes already cast passes the threshold limit.
     */
    function _quorumReached(
        uint256 proposalId
    ) internal view virtual returns (bool);

    /**
     * @dev Is the proposal successful or not.
     */
    function _voteSucceeded(
        uint256 proposalId
    ) internal view virtual returns (bool);

    /**
     * @dev Get the voting weight of `account`.
     */
    function _getVotes(address account) internal view virtual returns (uint8);

    /**
     * @dev Register a vote for `proposalId` by `account` with a given `support` and voting `weight``.
     *
     * Note: Support is generic and can represent various things depending on the voting system used.
     */
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight
    ) internal virtual;

    /**
     * @dev See {IGovernor-propose}. This function has opt-in frontrunning protection, described in {_isValidDescriptionForProposer}.
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public virtual override returns (uint256) {
        address proposer = msg.sender;

        uint256 currentTimepoint = clock();

        uint256 proposalId = hashProposal(
            targets,
            values,
            calldatas,
            keccak256(bytes(description))
        );

        if (
            targets.length != values.length ||
            targets.length != calldatas.length ||
            targets.length == 0
        ) {
            revert GovernorInvalidProposalLength(
                targets.length,
                calldatas.length,
                values.length
            );
        }
        if (_proposals[proposalId].voteStart != 0) {
            revert GovernorUnexpectedProposalState(
                proposalId,
                state(proposalId),
                bytes32(0)
            );
        }

        uint256 deadline = currentTimepoint + votingPeriod();

        _proposals[proposalId] = ProposalCore({
            proposer: proposer,
            voteStart: SafeCast.toUint64(currentTimepoint),
            voteEnd: SafeCast.toUint64(deadline),
            executed: false,
            canceled: false
        });

        emit ProposalCreated(
            proposalId,
            proposer,
            targets,
            values,
            new string[](targets.length),
            calldatas,
            currentTimepoint,
            deadline,
            description
        );

        return proposalId;
    }

    /**
     * @dev See {IGovernor-execute}.
     */
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public payable virtual override returns (uint256) {
        uint256 proposalId = hashProposal(
            targets,
            values,
            calldatas,
            descriptionHash
        );

        ProposalState currentState = state(proposalId);
        if (currentState != ProposalState.Succeeded) {
            revert GovernorUnexpectedProposalState(
                proposalId,
                currentState,
                _encodeStateBitmap(ProposalState.Succeeded)
            );
        }
        _proposals[proposalId].executed = true;

        emit ProposalExecuted(proposalId);

        _execute(targets, values, calldatas, descriptionHash);

        return proposalId;
    }

    /**
     * @dev See {IGovernor-cancel}.
     */
    function cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public virtual override returns (uint256) {
        uint256 proposalId = hashProposal(
            targets,
            values,
            calldatas,
            descriptionHash
        );
        uint256 voteCount = getProposalVotesCount(proposalId);
        if (voteCount != 0) {
            revert GovernorProposalAlreadyVotedOn(proposalId, voteCount);
        }
        if (msg.sender != proposalProposer(proposalId)) {
            revert GovernorOnlyProposer(msg.sender);
        }
        return _cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Internal cancel mechanism: locks up the proposal timer, preventing it from being re-submitted. Marks it as
     * canceled to allow distinguishing it from executed proposals.
     *
     * Emits a {IGovernor-ProposalCanceled} event.
     */
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual returns (uint256) {
        uint256 proposalId = hashProposal(
            targets,
            values,
            calldatas,
            descriptionHash
        );

        ProposalState currentState = state(proposalId);

        bytes32 forbiddenStates = _encodeStateBitmap(ProposalState.Canceled) |
            _encodeStateBitmap(ProposalState.Expired) |
            _encodeStateBitmap(ProposalState.Executed);
        if (forbiddenStates & _encodeStateBitmap(currentState) != 0) {
            revert GovernorUnexpectedProposalState(
                proposalId,
                currentState,
                _ALL_PROPOSAL_STATES_BITMAP ^ forbiddenStates
            );
        }
        _proposals[proposalId].canceled = true;

        emit ProposalCanceled(proposalId);

        return proposalId;
    }

    /**
     * @dev See {IGovernor-getVotes}.
     */
    function getVotes(
        address account
    ) public view virtual override returns (uint8) {
        return _getVotes(account);
    }

    /**
     * @dev See {IGovernor-castVote}.
     */
    function castVote(
        uint256 proposalId,
        uint8 support
    ) public virtual override returns (uint256) {
        address voter = msg.sender;
        return _castVote(proposalId, voter, support, "");
    }

    /**
     * @dev See {IGovernor-castVoteWithReason}.
     */
    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) public virtual override returns (uint256) {
        address voter = msg.sender;
        return _castVote(proposalId, voter, support, reason);
    }

    /**
     * @dev See {IGovernor-castVoteBySig}.
     */
    function castVoteBySig(
        uint256 proposalId,
        uint8 support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override returns (uint256) {
        address voter = ECDSA.recover(
            _hashTypedDataV4(
                keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support))
            ),
            v,
            r,
            s
        );
        return _castVote(proposalId, voter, support, "");
    }

    /**
     * @dev Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
     * voting weight using {IGovernor-getVotes} and call the {_countVote} internal function.
     *
     * Emits a {IGovernor-VoteCast} event.
     */
    function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason
    ) internal virtual returns (uint256) {
        ProposalState currentState = state(proposalId);
        if (currentState != ProposalState.Active) {
            revert GovernorUnexpectedProposalState(
                proposalId,
                currentState,
                _encodeStateBitmap(ProposalState.Active)
            );
        }

        uint256 weight = _getVotes(account);
        _countVote(proposalId, account, support, weight);

        emit VoteCast(account, proposalId, support, weight, reason);

        return weight;
    }

    /**
     * @dev Relays a transaction or function call to an arbitrary target. In cases where the governance executor
     * is some contract other than the governor itself, like when using a timelock, this function can be invoked
     * in a governance proposal to recover tokens or Ether that was sent to the governor contract by mistake.
     * Note that if the executor is simply the governor itself, use of `relay` is redundant.
     */
    function relay(
        address target,
        uint256 value,
        bytes calldata data
    ) external payable virtual onlyGovernance {
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        Address.verifyCallResult(success, returndata);
    }

    /**
     * @dev See {IERC721Receiver-onERC721Received}.
     * Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        if (_executor() != address(this)) {
            revert GovernorDisabledDeposit();
        }
        return this.onERC721Received.selector;
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155Received}.
     * Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).
     */
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        if (_executor() != address(this)) {
            revert GovernorDisabledDeposit();
        }
        return this.onERC1155Received.selector;
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155BatchReceived}.
     * Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        if (_executor() != address(this)) {
            revert GovernorDisabledDeposit();
        }
        return this.onERC1155BatchReceived.selector;
    }

    /**
     * @dev Encodes a `ProposalState` into a `bytes32` representation where each bit enabled corresponds to
     * the underlying position in the `ProposalState` enum. For example:
     *
     * 0x000...10000
     *   ^^^^^^------ ...
     *         ^----- Succeeded
     *          ^---- Defeated
     *           ^--- Canceled
     *            ^-- Active
     *             ^- Pending
     */
    function _encodeStateBitmap(
        ProposalState proposalState
    ) internal pure returns (bytes32) {
        return bytes32(1 << uint8(proposalState));
    }

    /**
     * @dev Try to parse a character from a string as a hex value. Returns `(true, value)` if the char is in
     * `[0-9a-fA-F]` and `(false, 0)` otherwise. Value is guaranteed to be in the range `0 <= value < 16`
     */
    function _tryHexToUint(bytes1 char) private pure returns (bool, uint8) {
        uint8 c = uint8(char);
        unchecked {
            // Case 0-9
            if (47 < c && c < 58) {
                return (true, c - 48);
            }
            // Case A-F
            else if (64 < c && c < 71) {
                return (true, c - 55);
            }
            // Case a-f
            else if (96 < c && c < 103) {
                return (true, c - 87);
            }
            // Else: not a hex char
            else {
                return (false, 0);
            }
        }
    }
}
