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
import { EVALUATION_32_CHAR_STRING } from "../test/TestConfig";

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

  return await propose(
    await utils.getContractAddress("TraceabilityContractFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );
}

async function voteFor(proposalId: string) {
  // 0 = Against, 1 = For, 2 = Abstain
  const decision = 1;
  const reason = EVALUATION_32_CHAR_STRING;
  return await vote(proposalId, decision, reason);
}

async function executeSupplychainContractCreation(
  memberAddress: string,
  requiredUpdateAttributeKeys?: string[]
) {
  const encodedFunctionCall = await encodeFunctionCallPromise(
    memberAddress,
    requiredUpdateAttributeKeys
  );

  return await execute(
    await utils.getContractAddress("TraceabilityContractFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );
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

  const { proposalId, gasUsed: gasUsedPropose } =
    await proposeCreateSupplychain(memberAddress, requiredUpdateAttributeKeys);

  const { gasUsed: gasUsedVote } = await voteFor(proposalId.toString());

  const { gasUsed: gasUsedExecute } = await executeSupplychainContractCreation(
    memberAddress,
    requiredUpdateAttributeKeys
  );

  // check that the contract was created
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const contractAddress = (await userRegistry.getMember(memberAddress))
    .managingContractAddress;
  return {
    contractAddress,
    proposalId,
    gasUsed: gasUsedPropose + gasUsedVote + gasUsedExecute,
    gasUsedPropose,
    gasUsedVote,
    gasUsedExecute,
  };
}
