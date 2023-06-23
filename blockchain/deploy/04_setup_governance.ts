import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers } from "hardhat";
import { padCenter, scriptName } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorContractDeployment = await get("GovernorContract");
  const governorTimelockDeployment = await get("GovernorTimelock");

  const deployerSigner = await ethers.getSigner(deployer);

  const governorContract = await ethers.getContractAt(
    "GovernorContract",
    governorContractDeployment.address,
    deployerSigner
  );
  const governorTimelock = await ethers.getContractAt(
    "GovernorTimelock",
    governorTimelockDeployment.address,
    deployerSigner
  );

  log(padCenter(scriptName(__filename), 50));
  log("Seting up governance...");

  const proposerRole = await governorTimelock.PROPOSER_ROLE();
  const executorRole = await governorTimelock.EXECUTOR_ROLE();
  const adminRole = await governorTimelock.DEFAULT_ADMIN_ROLE();

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

  log(padCenter("", 50));
};

export default func;
module.exports.tags = ["all", "dao", "setup"];
