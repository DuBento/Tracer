import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  SupplychainFactory,
  UserRegistry,
} from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";
import { padCenter, scriptName } from "../lib/utils";
import {
  MEMBER_DEV_INFO_URI,
  MEMBER_DEV_NAME,
  MEMBER_DEV_VOTING_POWER,
} from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { get, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Setting up factory address in User Registry...");

  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry", {
    signerAddress: deployer,
  });

  const supplychainFactory = await utils.getContract<SupplychainFactory>(
    "SupplychainFactory"
  );

  await userRegistry.setSupplychainFactoryAddress(
    await supplychainFactory.getAddress()
  );

  // @dev Add member for development
  await userRegistry.addMember(
    deployer,
    MEMBER_DEV_NAME,
    MEMBER_DEV_INFO_URI,
    MEMBER_DEV_VOTING_POWER
  );
};

module.exports = func;
module.exports.tags = ["all", "dao", "dao_addons", "setup"];
