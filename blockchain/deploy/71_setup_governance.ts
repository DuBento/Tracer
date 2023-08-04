import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  Executor,
  GovernorContract,
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

  const executorContract = await utils.getContract<Executor>("Executor", {
    signerAddress: deployer,
  });

  log(padCenter(scriptName(__filename), 50));

  await Promise.all([
    setupExecutor(executorContract, deployer),
    setupUserRegistry(executorContract, deployer),
    setupSupplychainFactory(executorContract, deployer),
  ]);
};

const setupExecutor = async function (
  executorContract: Executor,
  deployer: string
) {
  log("Setting up Executor...");

  const governorContract = await utils.getContract<GovernorContract>(
    "GovernorContract",
    { signerAddress: deployer }
  );

  executorContract.transferOwnership(await governorContract.getAddress());
  log("Executor owner: ", await executorContract.owner());
};

const setupUserRegistry = async function (
  executorContract: Executor,
  deployer: string
) {
  log("Setting up UserRegistry...");

  // Transfer owner to timelock
  const userRegistryContract = await utils.getContract<UserRegistry>(
    "UserRegistry",
    { signerAddress: deployer }
  );

  const transferOwnershipTx = await userRegistryContract.transferOwnership(
    await executorContract.getAddress()
  );
  await transferOwnershipTx.wait();
};

const setupSupplychainFactory = async function (
  executorContract: Executor,
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
      await executorContract.getAddress()
    );
  await transferOwnershipTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "setup"];