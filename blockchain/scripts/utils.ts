import { BaseContract } from "ethers";
import { artifacts } from "hardhat";

// general
export function padCenter(str: string, length: number, paddingChar = "-") {
  const paddingLength = length - str.length;
  const paddingLeftLength = Math.floor(paddingLength / 2);

  const paddedStr = str.padStart(str.length + paddingLeftLength, paddingChar);
  return paddedStr.padEnd(length, paddingChar);
}

export function scriptName(filename: string) {
  const path = require("path");
  return path.basename(filename);
}

// contracts

export async function saveFrontendFiles(
  contractName: string,
  contract: BaseContract
) {
  const fs = require("fs-extra");
  const path = require("path");

  const contractsDir = path.join(
    __dirname,
    "..",
    "artifacts",
    "frontend-artifacts"
  );
  fs.ensureDirSync(contractsDir);

  const abi = await getContractAbi(contractName);

  fs.writeFileSync(
    path.join(contractsDir, contractName + ".json"),
    JSON.stringify(
      { address: await contract.getAddress(), abi: abi },
      undefined,
      2
    )
  );

  // Copy type + abi files to frontend dir
  const frontendOutDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "contracts"
  );
  fs.emptyDirSync(frontendOutDir);
  fs.copySync(contractsDir, frontendOutDir, { overwrite: true });
}

async function getContractAbi(contractName: string) {
  const contractArtifacts = await artifacts.readArtifact(contractName);
  return contractArtifacts.abi;
}
