import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying SupplychainFactory...");

  const supplychainManagement = await get("SupplychainManagement");
  const userRegistry = await get("UserRegistry");

  const supplychainFactory = await deploy("SupplychainFactory", {
    from: deployer,
    args: [userRegistry.address, supplychainManagement.address],
    log: true,
    // TODO verify if live on network
  });
  log(`SupplychainFactory at ${supplychainFactory.address}`);

  // Transfer owner to timelock
  const supplychainFactoryContract = await ethers.getContractAt(
    "SupplychainFactory",
    supplychainFactory.address,
    await ethers.getSigner(deployer)
  );
  const governorTimelockDeployment = await get("GovernorTimelock");

  const transferOwnershipTx =
    await supplychainFactoryContract.transferOwnership(
      governorTimelockDeployment.address
    );
  await transferOwnershipTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "supplychain_factory"];
