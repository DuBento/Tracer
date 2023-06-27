import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, saveFrontendFiles, scriptName } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log } = deployments;

  const Supplychain = await ethers.getContractFactory("Supplychain");
  const supplychain = await Supplychain.deploy();

  log(padCenter(scriptName(__filename), 50));

  await supplychain.waitForDeployment();

  saveFrontendFiles("Supplychain", supplychain);

  log("Supplychain smart contract: deployed!");
};

export default func;
