import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying SupplychainFactory...");

  const supplychainFactory = await deploy("SupplychainFactory", {
    from: deployer,
    args: [],
    log: true,
    // TODO verify if live on network
  });

  log(`SupplychainFactory at ${supplychainFactory.address}`);
};

module.exports = func;
module.exports.tags = ["all", "dao", "supplychain_factory"];
