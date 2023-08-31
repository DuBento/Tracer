import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  padCenter,
  saveFrontendFiles,
  scriptName,
  storeAddress,
} from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre;
  const { log } = deployments;

  log(padCenter(scriptName(__filename), 50));

  const allDeployments = await deployments.all();
  for (let contractName in allDeployments) {
    storeAddress(contractName, allDeployments[contractName].address);
  }

  saveFrontendFiles();

  log("Frontend files moved");
};

module.exports = func;
module.exports.tags = ["all"];
