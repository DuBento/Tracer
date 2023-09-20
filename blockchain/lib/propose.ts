import { ethers, getChainId } from "hardhat";
import {
  GovernorContract,
  ProposalCreatedEvent,
} from "../artifacts-frontend/typechain/DAO/GovernorContract";
import * as utils from "../lib/utils";

export async function propose(
  proposalTarget: string,
  encodedCall: string,
  proposalDescription: string,
  signerAddress?: string
) {
  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract",
    { signerAddress }
  );

  // console.log(`Proposal Description:\n  ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [proposalTarget],
    [0],
    [encodedCall],
    proposalDescription
  );

  const receipt = await proposeTx.wait();
  if (receipt == null) throw new Error("Error completing transaction");
  const gasUsed = receipt!.gasUsed;

  const proposalId = (
    receipt.logs.find(
      (event: any) =>
        event instanceof ethers.EventLog && event.eventName == "ProposalCreated"
    ) as ProposalCreatedEvent.Log
  )?.args.proposalId;
  // console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  // const proposalState = await governor.state(proposalId);
  // const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  // const proposalDeadline = await governor.proposalDeadline(proposalId);

  // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
  // console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  // console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  // console.log(`Current Proposal Deadline: ${proposalDeadline}`);

  utils.storeProposalId(proposalId.toString(), await getChainId());

  return { proposalId, gasUsed };
}
