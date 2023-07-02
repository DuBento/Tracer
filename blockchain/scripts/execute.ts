import { ethers, getNamedAccounts, network } from "hardhat";
import {
  GovernorContract,
  SupplychainFactory,
} from "../artifacts-frontend/typechain";
import {
  DEVELOPMENT_CHAINS,
  MIN_DELAY,
  SUPPLYCHAIN_CREATE_METHOD,
  SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION,
} from "../properties";
import * as utils from "./utils";

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

async function executeSupplychainContractCreation() {
  const { supplychainManager } = await getNamedAccounts();
  return utils
    .encodeFunctionCall("SupplychainFactory", SUPPLYCHAIN_CREATE_METHOD, [
      supplychainManager,
    ])
    .then(async (encoded) =>
      execute(
        await utils.getContractAddress("SupplychainFactory"),
        encoded,
        SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION
      )
    )
    .then(async () => {
      // check that the contract was created
      const supplychainFactory = await utils.getContract<SupplychainFactory>(
        "SupplychainFactory"
      );
      console.log(
        `Address of created contract: ${await supplychainFactory.supplychainContracts(
          supplychainManager
        )}`
      );
    });
}

executeSupplychainContractCreation()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
