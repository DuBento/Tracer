import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorContractDeployment = await get("GovernorContract");
  const governorTimelockDeployment = await get("GovernorTimelock");

  const deployerSigner = await ethers.getSigner(deployer);

  const governorTimelock = await ethers.getContractAt(
    "GovernorTimelock",
    governorTimelockDeployment.address,
    deployerSigner
  );

  log(padCenter(scriptName(__filename), 50));

  const proposerRole = await governorTimelock.PROPOSER_ROLE();
  const executorRole = await governorTimelock.EXECUTOR_ROLE();
  const adminRole = await governorTimelock.DEFAULT_ADMIN_ROLE();

  /* Timelock */
  log("Seting up Timelock...");
  // Grant proposer to governor contract
  const proposerTx = await governorTimelock.grantRole(
    proposerRole,
    governorContractDeployment.address
  );
  await proposerTx.wait();

  // Allow all to execute (zero address)
  const executorTx = await governorTimelock.grantRole(
    executorRole,
    ethers.ZeroAddress
  );
  await executorTx.wait();

  // Revoke admin acces from deployer
  const revokeAdminTx = await governorTimelock.revokeRole(adminRole, deployer);
  await revokeAdminTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "setup"];
