import { getChainId, network } from "hardhat";
import { GovernorContract } from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";
import { DEVELOPMENT_CHAINS, VOTING_PERIOD } from "../properties";

export async function vote(
  proposalId: string,
  decision: number, // 0 = Against, 1 = For, 2 = Abstain
  reason: string,
  signerAddress?: string
) {
  console.log("Voting...");
  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract",
    { signerAddress }
  );

  const voteTx = await governor.castVoteWithReason(
    proposalId,
    decision,
    reason
  );
  await voteTx.wait();

  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  // Moving forward to the end of the voting period
  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await utils.increaseBlocks(VOTING_PERIOD + 1);
  }

  // Check the proposal state
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
  return proposalState;
}

export async function voteLastProposal() {
  const proposalId = utils.getLastProposalId(await getChainId());
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = "I like it!";
  await vote(proposalId, decision, reason);
}
