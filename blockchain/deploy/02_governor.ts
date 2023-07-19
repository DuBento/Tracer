import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../lib/utils";
import { VOTING_DELAY, VOTING_PERIOD, VOTING_QUORUM } from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorToken = await get("GovernorToken");

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorContract...");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [governorToken.address, VOTING_DELAY, VOTING_PERIOD, VOTING_QUORUM],
    log: true,
    // TODO verify if live on network
  });

  log(`GovernorContract at ${governorContract.address}`);
};

module.exports = func;
module.exports.tags = ["all", "dao", "governor"];
