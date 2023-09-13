import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import mockUpload from "../../mock/mockUpload.json";
import { Traceability, UserRegistry } from "../artifacts-frontend/typechain";
import { newBatch, utils } from "../lib";
import {
  TRACEABILITY_MOCK_ADDRESS_NAME,
  TRACEABILITY_MOCK_BATCH_DESCRIPTION,
  TRACEABILITY_MOCK_BATCH_ID_NAME,
  TRACEABILITY_MOCK_PRICE_INCREMENT,
  TRACEABILITY_MOCK_STARTING_PRICE,
} from "../properties";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { log, get, deploy } = deployments;
  const {
    deployer,
    supplychainManager,
    actor1,
    actor2,
    actor3,
    actor4,
    actor5,
  } = await getNamedAccounts();
  log(utils.padCenter(utils.scriptName(__filename), 50));
  const actors = [actor1, actor2, actor3, actor4, actor5];

  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME
  );

  // Add actors to user registry
  const userRegistry = await utils.getContract<UserRegistry>("UserRegistry", {
    signerAddress: supplychainManager,
  });

  let actorIdx = 0;

  const mockActorNames = Object.keys(mockUpload).filter(
    (key) => key !== "transaction"
  );

  for (const mockActor of mockActorNames) {
    if (actorIdx > actors.length - 1) break;

    const actorName = mockActor
      .replace(/^\d+_/, "")
      .replace(/\w/, (c) => c.toUpperCase());
    await userRegistry.addActor(actors[actorIdx], actorName, "");
    await userRegistry.addContractToActor(
      traceabilityAddress,
      actors[actorIdx]
    );
    actorIdx++;
  }

  // Get traceability contract
  let traceabilityContract = await utils.getContract<Traceability>(
    "Traceability",
    {
      contractAddress: traceabilityAddress,
      signerAddress: actors[0],
    }
  );

  // Create new batch
  const batchId = await newBatch(
    traceabilityContract,
    TRACEABILITY_MOCK_BATCH_DESCRIPTION,
    mockUpload.transaction[0].uri
  );

  utils.storeAddress(TRACEABILITY_MOCK_BATCH_ID_NAME, batchId.toString());
  log(`Batch created: id@${batchId.toString()}`);

  // Add updates and transactions
  actorIdx = 0;
  let price = TRACEABILITY_MOCK_STARTING_PRICE;

  for (const [transactionKey, trasactionUpdates] of Object.entries(
    mockUpload
  )) {
    if (transactionKey === "transaction") continue;
    // Connect with actor
    traceabilityContract = traceabilityContract.connect(
      await ethers.getSigner(actors[actorIdx])
    );

    // Add updates
    for (const update of trasactionUpdates) {
      await traceabilityContract.handleUpdate(batchId, update.uri);
      log(`Update added: ${update.name} by ${actors[actorIdx]}`);
    }

    // Add transaction
    if (actorIdx + 1 > actors.length - 1) break;
    await traceabilityContract.handleTransaction(
      batchId,
      actors[actorIdx + 1],
      mockUpload.transaction[0].uri,
      [`${price}.00$`]
    );

    actorIdx++;
    price += TRACEABILITY_MOCK_PRICE_INCREMENT;
  }
};

module.exports = func;
module.exports.tags = ["all", "mock"];
