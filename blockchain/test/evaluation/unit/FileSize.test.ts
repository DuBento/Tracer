import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Traceability } from "../../../artifacts-frontend/typechain";
import { newBatch } from "../../../lib";
import { BATCH_DESCRIPTION, EVALUATION_URI } from "../../TestConfig";
import { deploySupplychainFixture } from "../../fixtures/deploySupplychain.fixture";

describe("On chain files vs off chain (ipfs) comparation", function () {
  var traceabilityContract: Traceability;
  var supplyChainAddress: string;
  var deployer: string;
  var manager: string;
  var batchOwner: string;
  var batchId: string;

  before(async () => {
    const values = await loadFixture(deploySupplychainFixture);
    traceabilityContract = values.contract;
    supplyChainAddress = values.contractAddress;
    deployer = values.deployer;
    manager = values.supplychainManager;
    batchOwner = values.actor1;

    const { batchId: id } = await newBatch(
      traceabilityContract,
      BATCH_DESCRIPTION,
      EVALUATION_URI
    );
    batchId = id.toString();
  });

  function generateBase64String(sizeInBytes: number) {
    const data = Buffer.alloc(sizeInBytes, 1); // Create an array filled with ones with the desired size
    return data.toString("base64");
  }

  it("Get gas used for update, storing file on chain. Different file sizes", async () => {
    const KB = 1024;
    const sizes = [
      1 * KB,
      5 * KB,
      10 * KB,
      20 * KB,
      30 * KB,
      40 * KB,
      50 * KB,
      KB * KB /* 1MB */,
    ];
    const gasUsed = [];

    for (const size of sizes) {
      const string = generateBase64String(size);

      try {
        const tx = await traceabilityContract.handleUpdate(batchId, string);
        const receipt = await tx.wait();
        gasUsed.push(Number(receipt!.gasUsed));
      } catch (error) {
        gasUsed.push("error");
        continue;
      }
    }

    console.log(
      "Gas used for storing files on chain\n",
      `Sizes: ${sizes}\n`,
      `Gas: ${gasUsed}\n`
    );
  });

  it("Get gas used for update, storing file off chain (ipfs). Different file sizes", async () => {
    const KB = 1024;
    const sizes = [
      1 * KB,
      5 * KB,
      10 * KB,
      20 * KB,
      30 * KB,
      40 * KB,
      50 * KB,
      KB * KB /* 1MB */,
    ];
    const gasUsed = [];

    for (const size of sizes) {
      try {
        const tx = await traceabilityContract.handleUpdate(
          batchId,
          EVALUATION_URI
        );
        const receipt = await tx.wait();
        gasUsed.push(Number(receipt!.gasUsed));
      } catch (error) {
        gasUsed.push("error");
        continue;
      }
    }

    console.log(
      "Gas used for storing files off-chain\n",
      `Sizes: ${sizes}\n`,
      `Gas: ${gasUsed}\n`
    );
  });
});
