import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying Supplychain Management contract...");

  const userRegistry = await get("UserRegistry");

  const supplychainManagement = await deploy("SupplychainManagement", {
    from: deployer,
    args: [userRegistry.address],
    log: true,
    // TODO verify if live on network
  });
  log(`SupplychainManagement at ${supplychainManagement.address}`);
};

module.exports = func;
module.exports.tags = ["all", "dao", "user_registry"];
