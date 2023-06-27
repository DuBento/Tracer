import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName, storeContractAddress } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorToken...");

  const governorToken = await deploy("GovernorToken", {
    from: deployer,
    args: [],
    log: true,
    // TODO verify if live on network
  });

  storeContractAddress("GovernorToken", governorToken.address);
  log(`GovernorToken at ${governorToken.address}`);
};

export default func;
module.exports.tags = ["all", "dao", "token"];
