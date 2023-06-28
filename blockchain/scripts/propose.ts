import { ProposalCreatedEvent } from "@/artifacts-frontend/typechain/DAO/GovernorContract";
import { ethers, network } from "hardhat";
import {
  DEFAULT_VOTING_DELAY,
  SUPPLYCHAIN_CREATE_MANAGER_SIGNER_PROMISE,
  SUPPLYCHAIN_CREATE_METHOD,
  SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION,
  developmentChains,
} from "../properties";
import * as utils from "./utils";

export async function propose(
  encodedCall: string,
  proposalDescription: string
): Promise<bigint> {
  const supplychainFactoryAddress =
    utils.getContractAddress("SupplychainFactory");

  const governor = await utils.getContract("GovernorContract");

  console.log(`Proposal Description:\n  ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [supplychainFactoryAddress],
    [0],
    [encodedCall],
    proposalDescription
  );

  const receipt = await proposeTx.wait();
  if (receipt == null) throw new Error("Error completing transaction");

  const proposalId = (
    receipt.logs.find(
      (event: any) =>
        event instanceof ethers.EventLog && event.eventName == "ProposalCreated"
    ) as ProposalCreatedEvent.Log
  )?.args.proposalId;
  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await utils.incrementBlocks(DEFAULT_VOTING_DELAY + 1);
  }

  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);

  // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
  console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);

  return proposalId;
}

async function encodeFunctionCall(
  contractName: string,
  methodName: string,
  args: string[]
): Promise<string> {
  const contractFactory = await ethers.getContractFactory(contractName);

  console.log(`Encoding ${methodName} with args ${args} => on ${contractName}`);
  const encodedFunctionCall = contractFactory.interface.encodeFunctionData(
    methodName,
    await args
  );
  return encodedFunctionCall;
}

async function proposeCreateSupplychain() {
  return encodeFunctionCall("SupplychainFactory", SUPPLYCHAIN_CREATE_METHOD, [
    (await SUPPLYCHAIN_CREATE_MANAGER_SIGNER_PROMISE).address,
  ]).then((encoded) =>
    propose(encoded, SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION)
  );
}

proposeCreateSupplychain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
