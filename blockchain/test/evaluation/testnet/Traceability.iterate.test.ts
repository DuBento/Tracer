import { assert } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { Traceability } from "../../../artifacts-frontend/typechain";
import { NewBatchEvent } from "../../../artifacts-frontend/typechain/Traceability/Traceability";
import { utils } from "../../../lib";
import {
  DEVELOPMENT_CHAINS,
  TRACEABILITY_MOCK_ADDRESS_NAME,
} from "../../../properties";
import {
  EVALUATION_31_CHAR_STRING,
  UPDATE_DOCUMENT_URI,
} from "../../TestConfig";

const NUMBER_OF_ITERATIONS = 50;

describe("Traceability iterative evaluation (times)", function () {
  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME,
    network.name
  );
  var actor1: string;
  var actor2: string;
  var traceabilityContract: Traceability;
  var batchId: string;

  before(async function () {
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

    // Create new batch
    batchId = await createNewBatch();
  });

  async function createNewBatch() {
    const startTime = performance.now();
    const tx = await traceabilityContract.newBatch(
      EVALUATION_31_CHAR_STRING,
      UPDATE_DOCUMENT_URI
    );
    const receipt = await tx.wait();
    const receiptTime = performance.now();

    assert.isNotNull(receipt, "Error completing transaction");

    const newBatchEvent = (
      receipt!.logs.find(
        (event) =>
          event instanceof ethers.EventLog && event.eventName == "NewBatch"
      ) as NewBatchEvent.Log
    )?.args;

    const batchId = newBatchEvent.id.toString();
    return batchId;
  }

  it("Latency for ${NUMBER_OF_ITERATIONS} update batch", async function () {
    const maxTimeForEachIteration = 90000;
    this.timeout(maxTimeForEachIteration * NUMBER_OF_ITERATIONS);

    const timeArray = [];
    for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
      const startTime = performance.now();
      const tx = await traceabilityContract.handleUpdate(
        batchId,
        UPDATE_DOCUMENT_URI
      );
      await tx.wait();
      const receiptTime = performance.now();
      timeArray.push(receiptTime - startTime);
    }
    console.log(
      `Receipt times for ${NUMBER_OF_ITERATIONS} updates (ms): ${
        timeArray.reduce((a, b) => a + b, 0) / timeArray.length
      } ms (mean)\n${timeArray}`
    );
  });

  it(`Latency for ${NUMBER_OF_ITERATIONS} get batch`, async function () {
    const timeArray = [];
    for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
      const startTime = performance.now();
      const tx = await traceabilityContract.getBatch(batchId);
      const receiptTime = performance.now();
      timeArray.push(receiptTime - startTime);
    }
    console.log(
      `Receipt times for ${NUMBER_OF_ITERATIONS} getBatch (ms): ${
        timeArray.reduce((a, b) => a + b, 0) / timeArray.length
      } ms (mean)\n${timeArray}`
    );
  });
});
