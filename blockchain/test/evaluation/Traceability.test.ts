import { getNamedAccounts, network } from "hardhat";
import { Traceability } from "../../artifacts-frontend/typechain";
import { utils } from "../../lib";
import { TRACEABILITY_MOCK_ADDRESS_NAME } from "../../properties";
import { BATCH_DESCRIPTION, UPDATE_DOCUMENT_URI } from "../TestConfig";

describe("Traceability evaluation", function () {
  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME,
    network.name
  );
  var actor1: string;
  var actor2: string;

  before(async function () {
    const namedAccounts = await getNamedAccounts();
    actor1 = namedAccounts.actor1;
    actor2 = namedAccounts.actor2;
  });

  it("New batch", async function () {
    // Create new batch
    const traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      {
        contractAddress: traceabilityAddress,
        signerAddress: actor1,
      }
    );

    const startTime = performance.now();
    const tx = await traceabilityContract.newBatch(
      BATCH_DESCRIPTION,
      UPDATE_DOCUMENT_URI
    );
    await tx.wait();
    const receiptTime = performance.now();
    console.log(`Receipt time: ${receiptTime - startTime} ms`);
  });
});
