import { ethers, artifacts } from "hardhat";
import { BaseContract, ContractFactory } from "ethers";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.deployed();

  console.log(`SupplyChain smart contract: deployed!`);

  saveFrontendFiles("SupplyChain", supplyChain);
}

export async function saveFrontendFiles(
  contractName: string,
  contract: BaseContract
) {
  const fs = require("fs");
  const fse = require("fs-extra");
  const path = require("path");

  const contractsDir = path.join(
    __dirname,
    "..",
    "artifacts",
    "frontend-artifacts"
  );

  if (!fs.existsSync(contractsDir)) {
    fse.mkdirSync(contractsDir);
  }

  const abi = await getContractAbi(contractName);

  fs.writeFileSync(
    path.join(contractsDir, contractName + ".json"),
    JSON.stringify({ address: contract.address, abi: abi }, undefined, 2)
  );

  // Copy type + abi files to frontend dir
  const frontendOutDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "contracts"
  );

  fse.copySync(contractsDir, frontendOutDir, { overwrite: true });
}

async function getContractAbi(contractName: string) {
  const contractArtifacts = await artifacts.readArtifact(contractName);
  return contractArtifacts.abi;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
