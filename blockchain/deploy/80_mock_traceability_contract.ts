import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { UserRegistry } from "../artifacts-frontend/typechain";
import { newMemberViaGovernance } from "../lib/newMemberViaGovernance";
import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";
import { getContract, padCenter, scriptName, storeAddress } from "../lib/utils";
import { TRACEABILITY_MOCK_ADDRESS_NAME } from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log, get, deploy } = deployments;
  const { deployer, supplychainManager, actor1, actor2, actor3 } =
    await getNamedAccounts();
  log(padCenter(scriptName(__filename), 50));

  const { member } = await newMemberViaGovernance(supplychainManager);

  const { contractAddress } = await newSupplychainContractViaGovernance(
    supplychainManager
  );

  const userRegistry = await getContract<UserRegistry>("UserRegistry", {
    signerAddress: supplychainManager,
  });
  // Add allowed actor
  await Promise.all([
    userRegistry.addContractToActor(contractAddress, actor1),
    userRegistry.addContractToActor(contractAddress, actor1),
    userRegistry.addContractToActor(contractAddress, actor2),
  ]);

  storeAddress(TRACEABILITY_MOCK_ADDRESS_NAME, contractAddress);

  log(`Supplychain smart contract: deployed @ ${contractAddress}`);
};

module.exports = func;
module.exports.tags = ["all", "mock"];
