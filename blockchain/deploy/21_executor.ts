import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../lib/utils";
import { BLOCK_CONFIRMATIONS } from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying Executor...");

  const executor = await deploy("Executor", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: BLOCK_CONFIRMATIONS,
  });

  log(`Executor at ${executor.address}`);
};

module.exports = func;
module.exports.tags = ["all", "dao", "executor"];
