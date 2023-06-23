import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, scriptName } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorToken = await get("GovernorToken");
  const governorTimelock = await get("GovernorTimelock");

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorContract...");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [governorToken.address, governorTimelock.address],
    log: true,
    // TODO verify if live on network
  });

  log(`GovernorContract at ${governorContract.address}`);

  log(padCenter("", 50));
};

export default func;
module.exports.tags = ["all", "dao", "governor"];
