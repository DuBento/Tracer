import { ethers } from "hardhat";
import { saveFrontendFiles, storeAddress } from "./utils";

async function main() {
  const Supplychain = await ethers.getContractFactory("Supplychain");
  const supplychain = await Supplychain.deploy();

  await supplychain.waitForDeployment();

  console.log(`Supplychain smart contract: deployed!`);

  storeAddress("Supplychain", await supplychain.getAddress());
  saveFrontendFiles();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
