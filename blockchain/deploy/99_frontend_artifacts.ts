import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  padCenter,
  saveFrontendFiles,
  scriptName,
  storeContractAddress,
} from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre;
  const { log } = deployments;

  log(padCenter(scriptName(__filename), 50));

  const allDeployments = await deployments.all();
  for (let contractName in allDeployments) {
    storeContractAddress(contractName, allDeployments[contractName].address);
  }

  saveFrontendFiles();

  log("Frontend files moved");
};

export default func;
module.exports.tags = ["all"];
