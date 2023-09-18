import { ethers, network } from "hardhat";
import { saveFrontendFiles, storeAddress } from "./utils";

async function main() {
  const Traceability = await ethers.getContractFactory("Traceability");
  const Traceability = await Traceability.deploy();

  await Traceability.waitForDeployment();

  console.log(`Traceability smart contract: deployed!`);

  storeAddress("Traceability", await Traceability.getAddress(), network.name);
  saveFrontendFiles();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
