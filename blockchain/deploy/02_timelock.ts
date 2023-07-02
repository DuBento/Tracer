import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { MIN_DELAY } from "../properties";
import { padCenter, scriptName } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorTimelock...");

  const governorTimelock = await deploy("GovernorTimelock", {
    from: deployer,
    args: [
      MIN_DELAY,
      [], // Proposers: empty before governor contract is deployed
      [ethers.ZeroAddress], // Executers: allow all to execute (zero address)
      deployer, // Admin: deployer, renounce in setup
    ],
    log: true,
    // TODO verify if live on network
  });

  log(`GovernorTimelock at ${governorTimelock.address}`);
};

export default func;
module.exports.tags = ["all", "dao", "timelock"];
