import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { deployments, ethers } from "hardhat";
import { GovernorToken } from "../artifacts-frontend/typechain";
import { padCenter, scriptName } from "../lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(padCenter(scriptName(__filename), 50));
  log("Deploying GovernorToken...");

  const governorToken = await deploy("GovernorToken", {
    from: deployer,
    args: [],
    log: true,
    // TODO verify if live on network
  });

  await delegateVotingPower(deployer, governorToken.address);

  log(`GovernorToken at ${governorToken.address}`);
};

const delegateVotingPower = async function (
  account: string,
  tokenAddress: string
) {
  const governorToken = (await ethers.getContractAt(
    "GovernorToken",
    tokenAddress
  )) as unknown as GovernorToken;

  const delegateResponse = await governorToken.delegate(account);
  await delegateResponse.wait();

  deployments.log(
    `Current checkpoints (greater than 0 for delagate to be successful): ${await governorToken.numCheckpoints(
      account
    )}`
  );
};

module.exports = func;
module.exports.tags = ["all", "dao", "token"];
