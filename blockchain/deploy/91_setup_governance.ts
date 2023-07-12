import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  GovernorTimelock,
  SupplychainFactory,
  UserRegistry,
} from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";
import { padCenter, scriptName } from "../lib/utils";

var log = console.log;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();
  log = deployments.log;

  const governorContractDeployment = await get("GovernorContract");

  const governorTimelock = await utils.getContract<GovernorTimelock>(
    "GovernorTimelock",
    { signerAddress: deployer }
  );

  log(padCenter(scriptName(__filename), 50));

  await setupTimelock(
    governorTimelock,
    governorContractDeployment.address,
    deployer
  );

  await setupUserRegistry(governorTimelock, deployer);
  await setupSupplychainFactory(governorTimelock, deployer);
};

const setupTimelock = async function (
  governorTimelock: GovernorTimelock,
  governorAddress: string,
  deployerAddress: string
) {
  const proposerRole = await governorTimelock.PROPOSER_ROLE();
  const executorRole = await governorTimelock.EXECUTOR_ROLE();
  const adminRole = await governorTimelock.DEFAULT_ADMIN_ROLE();

  log("Setting up Timelock...");
  // Grant proposer to governor contract
  const proposerTx = await governorTimelock.grantRole(
    proposerRole,
    governorAddress
  );
  await proposerTx.wait();

  // Allow all to execute (zero address)
  const executorTx = await governorTimelock.grantRole(
    executorRole,
    ethers.ZeroAddress
  );
  await executorTx.wait();

  // Revoke admin acces from deployer
  const revokeAdminTx = await governorTimelock.revokeRole(
    adminRole,
    deployerAddress
  );
  await revokeAdminTx.wait();
};

const setupUserRegistry = async function (
  governorTimelock: GovernorTimelock,
  deployer: string
) {
  log("Setting up UserRegistry...");

  // Transfer owner to timelock
  const userRegistryContract = await utils.getContract<UserRegistry>(
    "UserRegistry",
    { signerAddress: deployer }
  );

  const transferOwnershipTx = await userRegistryContract.transferOwnership(
    await governorTimelock.getAddress()
  );
  await transferOwnershipTx.wait();
};

const setupSupplychainFactory = async function (
  governorTimelock: GovernorTimelock,
  deployer: string
) {
  log("Setting up SupplychainFactory...");

  // Transfer owner to timelock
  const supplychainFactoryContract =
    await utils.getContract<SupplychainFactory>("SupplychainFactory", {
      signerAddress: deployer,
    });

  const transferOwnershipTx =
    await supplychainFactoryContract.transferOwnership(
      await governorTimelock.getAddress()
    );
  await transferOwnershipTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "setup"];
