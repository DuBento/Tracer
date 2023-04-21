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
  const path = require("path");

  const contractsDir = path.join(__dirname, "..", "..", "abi");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const abi = await getContractAbi(contractName);

  fs.writeFileSync(
    path.join(contractsDir, contractName + ".json"),
    JSON.stringify({ address: contract.address, abi: abi }, undefined, 2)
  );
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
