import { ethers, network } from "hardhat";
import { GovernorContract } from "../artifacts-frontend/typechain";
import * as utils from "../lib/utils";
import { DEVELOPMENT_CHAINS, MIN_DELAY } from "../properties";

export async function execute(
  proposalTarget: string,
  encodedCall: string,
  proposalDescription: string
) {
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes(proposalDescription)
  );

  const governor = await utils.getContract<GovernorContract>(
    "GovernorContract"
  );

  console.log("Queueing...");
  const queueTx = await governor.queue(
    [proposalTarget],
    [0],
    [encodedCall],
    descriptionHash
  );
  await queueTx.wait();

  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await utils.increaseBlocks(1);
    await utils.increaseTime(MIN_DELAY + 1);
  }

  console.log("Executing...");
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [proposalTarget],
    [0],
    [encodedCall],
    descriptionHash
  );
  await executeTx.wait();
}
