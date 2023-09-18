import { ethers } from "ethers";
import { UserRegistry } from "../artifacts-frontend/typechain";
import { execute } from "../lib/execute";
import { propose } from "../lib/propose";
import * as utils from "../lib/utils";
import { vote } from "../lib/vote";
import {
  SUPPLYCHAIN_CONTRACT_DESCRIPTION,
  SUPPLYCHAIN_CREATE_METHOD,
  SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION,
} from "../properties";

const encodeFunctionCallPromise = (
  memberAddress: string,
  requiredUpdateAttributeKeys?: string[]
) =>
  utils.encodeFunctionCall(
    "TraceabilityContractFactory",
    SUPPLYCHAIN_CREATE_METHOD,
    [
      memberAddress,
      SUPPLYCHAIN_CONTRACT_DESCRIPTION,
      requiredUpdateAttributeKeys || [],
    ]
  );

async function proposeCreateSupplychain(
  memberAddress: string,
  requiredUpdateAttributeKeys?: string[]
) {
  const encodedFunctionCall = await encodeFunctionCallPromise(
    memberAddress,
    requiredUpdateAttributeKeys
  );

  const proposalId = await propose(
    await utils.getContractAddress("TraceabilityContractFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );

  return proposalId;
}

async function voteFor(proposalId: string) {
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = "I like it!";
  await vote(proposalId, decision, reason);
}

async function executeSupplychainContractCreation(
  memberAddress: string,
  requiredUpdateAttributeKeys?: string[]
): Promise<string> {
  const encodedFunctionCall = await encodeFunctionCallPromise(
    memberAddress,
    requiredUpdateAttributeKeys
  );

  await execute(
    await utils.getContractAddress("TraceabilityContractFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );

  // check that the contract was created
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const contractAddress = (await userRegistry.getMember(memberAddress))
    .managingContractAddress;
  return contractAddress;
}

async function checkExistingContract(memberAddress: string): Promise<string> {
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const contractAddress = (await userRegistry.getMember(memberAddress))
    .managingContractAddress;
  return contractAddress;
}

export async function newSupplychainContractViaGovernance(
  memberAddress: string,
  requiredUpdateAttributeKeys?: string[]
) {
  const existingContractOrEmpty = await checkExistingContract(memberAddress);

  if (existingContractOrEmpty != ethers.ZeroAddress) {
    console.log(
      `Address of existing contract: ${existingContractOrEmpty}. Skipping...`
    );
    return { proposalId: 0, contractAddress: existingContractOrEmpty };
  }

  const proposalId = await proposeCreateSupplychain(
    memberAddress,
    requiredUpdateAttributeKeys
  );

  await voteFor(proposalId.toString());

  const contractAddress = await executeSupplychainContractCreation(
    memberAddress,
    requiredUpdateAttributeKeys
  );
  console.log(`Address of created contract: ${contractAddress}`);

  return { proposalId, contractAddress };
}
