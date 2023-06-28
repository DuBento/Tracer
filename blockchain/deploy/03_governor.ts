import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { VOTING_DELAY, VOTING_PERIOD, VOTING_QUORUM } from "../properties";
import { padCenter, scriptName, storeContractAddress } from "../scripts/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const governorToken = await get("GovernorToken");
  const governorTimelock = await get("GovernorTimelock");

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorContract...");

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governorToken.address,
      governorTimelock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      VOTING_QUORUM,
    ],
    log: true,
    // TODO verify if live on network
  });

  storeContractAddress("GovernorContract", governorContract.address);
  log(`GovernorContract at ${governorContract.address}`);
};

export default func;
module.exports.tags = ["all", "dao", "governor"];
