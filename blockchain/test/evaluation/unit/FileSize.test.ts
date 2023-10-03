import { deployments, getNamedAccounts, network } from "hardhat";
import { Traceability } from "../../../artifacts-frontend/typechain";
import { newBatch, utils } from "../../../lib";
import {
  DEVELOPMENT_CHAINS,
  TRACEABILITY_MOCK_ADDRESS_NAME,
} from "../../../properties";
import { BATCH_DESCRIPTION, EVALUATION_URI } from "../../TestConfig";

describe("On chain files vs off chain (ipfs) comparation", function () {
  this.timeout(0); // Disable test timeout

  const traceabilityAddress = utils.getStoredAddress(
    TRACEABILITY_MOCK_ADDRESS_NAME,
    network.name
  );
  var traceabilityContract: Traceability;
  var manager: string;
  var actor1: string;
  var batchId: string;

  before(async () => {
    if (DEVELOPMENT_CHAINS.includes(network.name)) {
      await deployments.fixture(["all"]);
    }
    const namedAccounts = await getNamedAccounts();
    manager = namedAccounts.supplychainManager;
    actor1 = namedAccounts.actor1;

    traceabilityContract = await utils.getContract<Traceability>(
      "Traceability",
      {
        contractAddress: traceabilityAddress,
        signerAddress: actor1,
      }
    );

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
        console.log("Gaslimit: ", tx.gasLimit);
        console.log("tx: ", tx.hash);
        const receipt = await tx.wait();
        gasUsed.push(Number(receipt!.gasUsed));
        console.log(`Size: ${size} bytes : ${receipt!.gasUsed} gas`);
      } catch (error: any) {
        gasUsed.push("error");
        console.log(
          `Size: ${size} bytes : error ${error.message} ${error.code} ${error.data}`
        );
        console.log(JSON.stringify(error));
        console.error(error);
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
        console.log(`Size: ${size} bytes : ${receipt!.gasUsed} gas`);
      } catch (error) {
        gasUsed.push("error");
        console.log(`Size: ${size} bytes : error`);
        console.error(error);
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
