import { getNamedAccounts } from "hardhat";
import { Traceability } from "../../artifacts-frontend/typechain";
import { newBatch, utils } from "../../lib";
import { TRACEABILITY_MOCK_ADDRESS_NAME } from "../../properties";
import { BATCH_DESCRIPTION } from "../TestConfig";

describe("Traceability evaluation", function () {
  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME
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

    const batchId = await newBatch(traceabilityContract, BATCH_DESCRIPTION);

    console.log(`Batch created: ${batchId}`);
  });
});
