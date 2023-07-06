import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying User Registry...");

  const userRegistry = await deploy("UserRegistry", {
    from: deployer,
    args: [],
    log: true,
    // TODO verify if live on network
  });
  log(`UserRegistry at ${userRegistry.address}`);

  // Transfer owner to timelock
  const userRegistryContract = await ethers.getContractAt(
    "UserRegistry",
    userRegistry.address,
    await ethers.getSigner(deployer)
  );
  const governorTimelockDeployment = await get("GovernorTimelock");

  const transferOwnershipTx = await userRegistryContract.transferOwnership(
    governorTimelockDeployment.address
  );
  await transferOwnershipTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "user_registry"];
