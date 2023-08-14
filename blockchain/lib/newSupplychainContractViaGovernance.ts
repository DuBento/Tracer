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

const encodeFunctionCallPromise = (memberAddress: string) =>
  utils.encodeFunctionCall("SupplychainFactory", SUPPLYCHAIN_CREATE_METHOD, [
    memberAddress,
    SUPPLYCHAIN_CONTRACT_DESCRIPTION,
  ]);

async function proposeCreateSupplychain(memberAddress: string) {
  const encodedFunctionCall = await encodeFunctionCallPromise(memberAddress);

  const proposalId = await propose(
    await utils.getContractAddress("SupplychainFactory"),
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
  memberAddress: string
): Promise<string> {
  const encodedFunctionCall = await encodeFunctionCallPromise(memberAddress);

  await execute(
    await utils.getContractAddress("SupplychainFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );

  // check that the contract was created
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const contractAddress = (await userRegistry.members(memberAddress))
    .managingContractAddress;
  return contractAddress;
}

export async function newSupplychainContractViaGovernance(
  memberAddress: string
) {
  const proposalId = await proposeCreateSupplychain(memberAddress);

  await voteFor(proposalId.toString());

  const contractAddress = await executeSupplychainContractCreation(
    memberAddress
  );
  console.log(`Address of created contract: ${contractAddress}`);

  return { proposalId, contractAddress };
}
