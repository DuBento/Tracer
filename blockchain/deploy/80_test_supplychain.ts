import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { Supplychain } from "../artifacts-frontend/typechain";
import { getContract, padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log, get, deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  log(padCenter(scriptName(__filename), 50));

  const userRegistry = await get("UserRegistry");

  const supplychain = await deploy("Supplychain", {
    from: deployer,
    args: [],
    log: true,
    // TODO verify if live on network
  });

  const supplychainContract = await getContract<Supplychain>("Supplychain", {
    contractAddress: supplychain.address,
  });

  await supplychainContract["init(address,address)"](
    userRegistry.address,
    deployer
  );

  log("Supplychain smart contract: deployed!");
};

module.exports = func;
module.exports.tags = ["all", "supplychain"];
