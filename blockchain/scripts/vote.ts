const fs = require("fs-extra");
import { ethers, getChainId, network } from "hardhat";
import { GovernorContract } from "../artifacts-frontend/typechain";
import { DEVELOPMENT_CHAINS, VOTING_PERIOD } from "../properties";
import * as utils from "./utils";

export async function vote(
  proposalId: string,
  decision: number, // 0 = Against, 1 = For, 2 = Abstain
  reason: string
) {
  console.log("Voting...");
  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract"
  );
  const voteTx = await governor.castVoteWithReason(
    proposalId,
    decision,
    reason
  );
  const receipt = await voteTx.wait();

  const event = receipt?.logs.find(
    (event: any) => event instanceof ethers.EventLog
  ) as unknown;

  console.log(`Proposed with proposal ID:\n  ${proposalId}`);
  console.log({ event });

  // Moving forward to the end of the voting period
  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await utils.incrementBlocks(VOTING_PERIOD + 1);
  }

  // Check the proposal state
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
}

async function main() {
  const proposalId = utils.getLastProposalId(await getChainId());
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = "I like it!";
  await vote(proposalId, decision, reason);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
