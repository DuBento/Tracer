import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, scriptName, storeContractAddress } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log } = deployments;

  const Supplychain = await ethers.getContractFactory("Supplychain");
  const supplychain = await Supplychain.deploy();

  log(padCenter(scriptName(__filename), 50));

  await supplychain.waitForDeployment();

  storeContractAddress("Supplychain", await supplychain.getAddress());

  log("Supplychain smart contract: deployed!");
};

module.exports = func;
module.exports.tags = ["all", "supplychain"];
