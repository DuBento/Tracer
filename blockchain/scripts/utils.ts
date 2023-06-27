import { ethers, network } from "hardhat";
import { FRONTEND_ARTIFACTS_PATH } from "../hardhat.config";

const fs = require("fs-extra");
const path = require("path");

const contractsDir = path.join(__dirname, "..", FRONTEND_ARTIFACTS_PATH);
console.log(contractsDir);
const frontendOutDir = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "contracts"
);

const contractAddressesFile = path.join(contractsDir, "deployedAddresses.json");

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

export async function saveFrontendFiles() {
  if (!fs.pathExistsSync(contractsDir))
    throw new Error("Contract artifacts directory not found");

  // Copy type + abi files to frontend dir
  fs.emptyDirSync(frontendOutDir);
  fs.copySync(contractsDir, frontendOutDir, { overwrite: true });
}

export function storeContractAddress(name: string, address: string) {
  let addresses: any;
  if (!fs.pathExistsSync(contractAddressesFile)) addresses = {};
  else addresses = JSON.parse(fs.readFileSync(contractAddressesFile, "utf8"));

  fs.ensureFileSync(contractAddressesFile);

  addresses[name] = address;

  fs.writeFileSync(
    contractAddressesFile,
    JSON.stringify(addresses, null, 2),
    "utf8"
  );
}

export function getContractAddress(name: string): string {
  if (!fs.pathExistsSync(contractAddressesFile))
    throw new Error("Deployed contracts address file not found");

  return JSON.parse(fs.readFileSync(contractAddressesFile, "utf8"))[name];
}

export async function getSignerByIndex(idx: number) {
  const accounts = await ethers.getSigners();
  return accounts[idx];
}

export async function incrementBlocks(nBlocks: number) {
  for (let i = 0; i < nBlocks; i++) {
    await network.provider.send("evm_mine");
  }
  console.log(`Incremented ${nBlocks} blocks`);
}
