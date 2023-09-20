import { assert } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { Traceability } from "../../../artifacts-frontend/typechain";
import { NewBatchEvent } from "../../../artifacts-frontend/typechain/Traceability/Traceability";
import { utils } from "../../../lib";
import {
  DEVELOPMENT_CHAINS,
  TRACEABILITY_MOCK_ADDRESS_NAME,
  TRACEABILITY_MOCK_REQUIRED_UPDATE_ATTRIBUTES_KEYS,
} from "../../../properties";
import {
  EVALUATION_32_CHAR_STRING,
  UPDATE_DOCUMENT_URI,
} from "../../TestConfig";

describe("Traceability evaluation", function () {
  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME,
    network.name
  );
  var actor1: string;
  var actor2: string;
  var traceabilityContract: Traceability;
  var batchId: string;

  before(async () => {
    if (DEVELOPMENT_CHAINS.includes(network.name)) {
      await deployments.fixture(["all"]);
    }
    const namedAccounts = await getNamedAccounts();
    actor1 = namedAccounts.actor1;
    actor2 = namedAccounts.actor2;

    traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      {
        contractAddress: traceabilityAddress,
        signerAddress: actor1,
      }
    );
  });

  it("New batch", async () => {
    // Create new batch
    const startTime = performance.now();
    const tx = await traceabilityContract.newBatch(
      EVALUATION_32_CHAR_STRING,
      UPDATE_DOCUMENT_URI
    );
    const receipt = await tx.wait();
    const receiptTime = performance.now();
    console.log(`Receipt time: ${receiptTime - startTime} ms`);

    assert.isNotNull(receipt, "Error completing transaction");

    const newBatchEvent = (
      receipt!.logs.find(
        (event) =>
          event instanceof ethers.EventLog && event.eventName == "NewBatch"
      ) as NewBatchEvent.Log
    )?.args;

    batchId = newBatchEvent.id.toString();
  });

  it("Update batch", async () => {
    const startTime = performance.now();
    const tx = await traceabilityContract.handleUpdate(
      batchId,
      UPDATE_DOCUMENT_URI
    );
    await tx.wait();
    const receiptTime = performance.now();
    console.log(`Receipt time: ${receiptTime - startTime} ms`);
  });

  it("Transaction", async () => {
    const attributes = new Array(
      TRACEABILITY_MOCK_REQUIRED_UPDATE_ATTRIBUTES_KEYS.length
    ).fill(EVALUATION_32_CHAR_STRING);

    const startTime = performance.now();
    const tx = await traceabilityContract.handleTransaction(
      batchId,
      actor2,
      UPDATE_DOCUMENT_URI,
      attributes
    );
    await tx.wait();
    const receiptTime = performance.now();
    console.log(`Receipt time: ${receiptTime - startTime} ms`);
  });

  it("Get batch", async () => {
    const startTime = performance.now();
    const tx = await traceabilityContract.getBatch(batchId);
    const receiptTime = performance.now();
    console.log(`Receipt time: ${receiptTime - startTime} ms`);
  });
});
