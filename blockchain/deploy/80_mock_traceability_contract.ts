import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { newMemberViaGovernance } from "../lib/newMemberViaGovernance";
import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";
import { padCenter, scriptName, storeAddress } from "../lib/utils";
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

  storeAddress(TRACEABILITY_MOCK_ADDRESS_NAME, contractAddress);

  log(`Supplychain smart contract: deployed @ ${contractAddress}`);
};

module.exports = func;
module.exports.tags = ["all", "mock"];