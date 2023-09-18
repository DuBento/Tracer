import { ethers } from "hardhat";

const NUMBER_OF_BLOCK_FOR_AVERAGE = 500;

describe("Latency evaluation", function () {
  before(async function () {});

  it(`Average block time for ${NUMBER_OF_BLOCK_FOR_AVERAGE} blocks`, async function () {
    const currentBlockNumber = await ethers.provider.getBlockNumber();
    const currentBlock = await ethers.provider.getBlock(currentBlockNumber);
    console.log("Current block: ", currentBlockNumber);

    const oldBlock = await ethers.provider.getBlock(
      currentBlockNumber - NUMBER_OF_BLOCK_FOR_AVERAGE
    );

    if (!currentBlock || !oldBlock) {
      throw new Error("Could not get blocks");
    }

    console.log(
      "Average latency: ",
      (currentBlock.timestamp - oldBlock.timestamp) /
        NUMBER_OF_BLOCK_FOR_AVERAGE
    );
  });
});
