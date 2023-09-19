import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  Executor,
  GovernorContract,
  TraceabilityContractFactory,
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

  await setupExecutor(executorContract, deployer);
  await setupUserRegistry(executorContract, deployer);
  await setupTraceabilityContractFactory(executorContract, deployer);
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

  if (
    (await executorContract.owner()) == (await governorContract.getAddress())
  ) {
    log("Executor already owned by GovernorContract. Skipping...");
    return;
  }

  return executorContract
    .transferOwnership(await governorContract.getAddress())
    .then((tx) => tx.wait());
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

  if (
    (await userRegistryContract.owner()) ==
    (await executorContract.getAddress())
  ) {
    log("UserRegistry already owned by ExecutorContract. Skipping...");
    return;
  }

  return userRegistryContract
    .transferOwnership(await executorContract.getAddress())
    .then((tx) => tx.wait());
};

const setupTraceabilityContractFactory = async function (
  executorContract: Executor,
  deployer: string
) {
  log("Setting up TraceabilityContractFactory...");

  // Transfer owner to timelock
  const traceabilityContractFactoryContract =
    await utils.getContract<TraceabilityContractFactory>(
      "TraceabilityContractFactory",
      {
        signerAddress: deployer,
      }
    );

  if (
    (await traceabilityContractFactoryContract.owner()) ==
    (await executorContract.getAddress())
  ) {
    log(
      "Traceability Contract Factory already owned by ExecutorContract. Skipping..."
    );
    return;
  }

  return traceabilityContractFactoryContract
    .transferOwnership(await executorContract.getAddress())
    .then((tx) => tx.wait());
};

module.exports = func;
module.exports.tags = ["all", "dao", "setup"];
