import { getNamedAccounts } from "hardhat";
import { UserRegistry } from "../artifacts-frontend/typechain";
import { execute } from "../lib/execute";
import { propose } from "../lib/propose";
import * as utils from "../lib/utils";
import { vote } from "../lib/vote";
import {
  SUPPLYCHAIN_CREATE_METHOD,
  SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION,
} from "../properties";

async function proposeCreateSupplychain() {
  const { supplychainManager } = await getNamedAccounts();

  const encodedFunctionCall = await utils.encodeFunctionCall(
    "SupplychainFactory",
    SUPPLYCHAIN_CREATE_METHOD,
    [supplychainManager]
  );

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

async function executeSupplychainContractCreation(): Promise<string> {
  const { supplychainManager } = await getNamedAccounts();
  const encodedFunctionCall = await utils.encodeFunctionCall(
    "SupplychainFactory",
    SUPPLYCHAIN_CREATE_METHOD,
    [supplychainManager]
  );

  await execute(
    await utils.getContractAddress("SupplychainFactory"),
    encodedFunctionCall,
    SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
  );

  // check that the contract was created
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry");
  const contractAddress = (await userRegistry.members(supplychainManager))
    .managingContractAddress;
  return contractAddress;
}

export async function newSupplychainContractViaGovernance() {
  const proposalId = await proposeCreateSupplychain();

  await voteFor(proposalId.toString());

  const contractAddress = await executeSupplychainContractCreation();
  console.log(`Address of created contract: ${contractAddress}`);

  return { proposalId, contractAddress };
}
