import { ethers } from "hardhat";
import { saveFrontendFiles } from "./utils";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.waitForDeployment();

  console.log(`SupplyChain smart contract: deployed!`);

  saveFrontendFiles("SupplyChain", supplyChain);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
