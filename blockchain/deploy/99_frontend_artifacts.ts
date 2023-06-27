import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { padCenter, saveFrontendFiles, scriptName } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log } = deployments;

  log(padCenter(scriptName(__filename), 50));
  saveFrontendFiles();

  log("Frontend files moved");
};

export default func;
module.exports.tags = ["all"];
