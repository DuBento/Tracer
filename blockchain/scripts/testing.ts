import { ethers } from "hardhat";

import { saveFrontendFiles } from "./deploy";
import * as Values from "../test/TestConfig";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.deployed();
  console.log(`SupplyChain smart contract: deployed!`);

  await supplyChain.newBatch(
    Values.BATCH_DESCRIPTION,
    Values.UPDATE_DOCUMENT_URI
  );

  saveFrontendFiles("SupplyChain", supplyChain);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
