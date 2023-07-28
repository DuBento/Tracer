import { EventLog } from "ethers";
import { getChainId, network } from "hardhat";
import { GovernorContract } from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";
import { DEVELOPMENT_CHAINS, VOTING_PERIOD } from "../properties";

export async function vote(
  proposalId: string,
  decision: number, // 0 = Against, 1 = For, 2 = Abstain
  reason: string,
  signerAddress?: string,
  moveTimeForward?: boolean
) {
  console.log("Voting...");
  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract",
    { signerAddress }
  );

  let proposalState = await governor.state(proposalId);
  console.log(`Before - Proposal State: ${proposalState}`);

  const voteTx = await governor.castVoteWithReason(
    proposalId,
    decision,
    reason
  );
  const receipt = await voteTx.wait();

  const events = receipt!.logs.filter(
    (log) => log instanceof EventLog
  ) as EventLog[];

  console.log(
    `Events reveived: ${JSON.stringify(events.map((event) => event.eventName))}`
  );
  console.log(
    `Events args: ${JSON.stringify(
      events.map((event) => event.args.toString())
    )}`
  );

  console.log(`Before - current clock: ${await governor.clock()}`);

  // Moving forward to the end of the voting period
  if (moveTimeForward && DEVELOPMENT_CHAINS.includes(network.name)) {
    await utils.increaseTime(VOTING_PERIOD + 1);
  }

  // Check the proposal state
  proposalState = await governor.state(proposalId);
  console.log(`After - Proposal State: ${proposalState}`);
  console.log(
    `After - deadline: ${await governor.proposalDeadline(proposalId)}`
  );
  console.log(`After - current clock: ${await governor.clock()}`);
  return proposalState;
}

export async function voteLastProposal() {
  const proposalId = utils.getLastProposalId(await getChainId());
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = "I like it!";
  await vote(proposalId, decision, reason);
}
