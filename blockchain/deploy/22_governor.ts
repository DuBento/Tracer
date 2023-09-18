import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../lib/utils";
import { BLOCK_CONFIRMATIONS, VOTING_PERIOD } from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const userRegistry = await get("UserRegistry");
  const executor = await get("Executor");

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorContract...");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [executor.address, userRegistry.address, VOTING_PERIOD],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: BLOCK_CONFIRMATIONS,
  });

  log(`GovernorContract at ${governorContract.address}`);
};

module.exports = func;
module.exports.tags = ["all", "dao", "governor"];
