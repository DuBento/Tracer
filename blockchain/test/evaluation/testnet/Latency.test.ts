import { ethers } from "hardhat";

const NUMBER_OF_BLOCK_FOR_AVERAGE = 500;
const NUMBER_OF_ITERATIONS = 25;

describe("Latency evaluation", function () {
  before(async function () {});

  it(`Average block time for ${NUMBER_OF_BLOCK_FOR_AVERAGE} blocks`, async function () {
    const currentBlockNumber = await ethers.provider.getBlockNumber();
    const currentBlock = await ethers.provider.getBlock(currentBlockNumber);
    console.log("Current block (ms): ", currentBlockNumber);

    const oldBlock = await ethers.provider.getBlock(
      currentBlockNumber > NUMBER_OF_BLOCK_FOR_AVERAGE
        ? currentBlockNumber - NUMBER_OF_BLOCK_FOR_AVERAGE
        : 0
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

  it(`Approximate network latency`, async function () {
    const times = [];
    for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
      const startTime = performance.now();
      await ethers.provider.getBlockNumber();
      const endTime = performance.now();
      times.push(endTime - startTime);
    }
    console.log(
      `Mean network latency for ${NUMBER_OF_ITERATIONS} calls (ms): ${
        times.reduce((a, b) => a + b, 0) / times.length
      }`
    );
  });
});
