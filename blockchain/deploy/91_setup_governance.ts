import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  GovernorContract,
  GovernorToken,
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

  const governorContract = await utils.getContract<GovernorContract>(
    "GovernorContract",
    { signerAddress: deployer }
  );

  log(padCenter(scriptName(__filename), 50));

  await setupGovernorToken(governorContract, deployer);
  await setupUserRegistry(governorContract, deployer);
  await setupSupplychainFactory(governorContract, deployer);
};

const setupGovernorToken = async function (
  governorContract: GovernorContract,
  deployer: string
) {
  log("Setting up GovernorToken...");

  const governorTokenContract = await utils.getContract<GovernorToken>(
    "GovernorToken",
    { signerAddress: deployer }
  );

  // Delegate token
  await delegateVotingPower(governorTokenContract, deployer);

  // Transfer owner to timelock
  const transferOwnershipTx = await governorTokenContract.transferOwnership(
    await governorContract.getAddress()
  );
  await transferOwnershipTx.wait();
};

const delegateVotingPower = async function (
  governorToken: GovernorToken,
  account: string
) {
  const delegateResponse = await governorToken.delegate(account);
  await delegateResponse.wait();

  log(
    `Current checkpoints (greater than 0 for delagate to be successful): ${await governorToken.numCheckpoints(
      account
    )}`
  );
};

const setupUserRegistry = async function (
  governorContract: GovernorContract,
  deployer: string
) {
  log("Setting up UserRegistry...");

  // Transfer owner to timelock
  const userRegistryContract = await utils.getContract<UserRegistry>(
    "UserRegistry",
    { signerAddress: deployer }
  );

  const transferOwnershipTx = await userRegistryContract.transferOwnership(
    await governorContract.getAddress()
  );
  await transferOwnershipTx.wait();
};

const setupSupplychainFactory = async function (
  governorContract: GovernorContract,
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
      await governorContract.getAddress()
    );
  await transferOwnershipTx.wait();
};

module.exports = func;
module.exports.tags = ["all", "dao", "setup"];
