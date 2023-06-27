import { ethers } from "hardhat";
import { saveFrontendFiles } from "./utils";

async function main() {
  const Supplychain = await ethers.getContractFactory("Supplychain");
  const supplyChain = await Supplychain.deploy();

  await supplyChain.waitForDeployment();

  console.log(`Supplychain smart contract: deployed!`);

  saveFrontendFiles("Supplychain", supplyChain);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
