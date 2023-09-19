import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { network } from "hardhat";
import { Traceability } from "../artifacts-frontend/typechain";
import { execute, propose, utils, vote } from "../lib";
import {
  TRACEABILITY_MOCK_ADDRESS_NAME,
  TRACEABILITY_MOCK_BATCH_ID_NAME,
} from "../properties";
import {
  PROPOSAL_DESCRIPTION,
  PROPOSAL_VOTE_DESCRIPTION,
} from "../test/TestConfig";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log, get, deploy } = deployments;
  const {
    deployer,
    supplychainManager,
    actor1,
    actor2,
    actor3,
    actor4,
    actor5,
  } = await getNamedAccounts();
  log(utils.padCenter(utils.scriptName(__filename), 50));

  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME,
    network.name
  );
  const batchId = utils.getStoredAddress(
    TRACEABILITY_MOCK_BATCH_ID_NAME,
    network.name
  );

  // Get traceability contract
  let traceabilityContractAsManager = await utils.getContract<Traceability>(
    "Traceability",
    {
      contractAddress: traceabilityAddress,
      signerAddress: supplychainManager,
    }
  );

  const nextState =
    await traceabilityContractAsManager.CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED();

  const encodedFunctionCall = await utils.encodeFunctionCall(
    "Traceability",
    "changeConformityState",
    [batchId, nextState.toString()]
  );

  const { proposalId } = await propose(
    traceabilityAddress,
    encodedFunctionCall,
    PROPOSAL_DESCRIPTION
  );

  const { proposalState } = await vote(
    proposalId.toString(),
    1 /* For */,
    PROPOSAL_VOTE_DESCRIPTION
  );

  await execute(traceabilityAddress, encodedFunctionCall, PROPOSAL_DESCRIPTION);
};

module.exports = func;
module.exports.tags = ["all", "mock"];
