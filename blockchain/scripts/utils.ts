import { ethers, network } from "hardhat";
import {
  CONTRACTS_DIR,
  CONTRACT_ADDRESS_FILE,
  FRONTEND_OUTPUT_DIR,
  PROPOSALS_FILE,
} from "../properties";

const fs = require("fs-extra");

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
  if (!fs.pathExistsSync(CONTRACTS_DIR))
    throw new Error("Contract artifacts directory not found");

  // Copy type + abi files to frontend dir
  fs.emptyDirSync(FRONTEND_OUTPUT_DIR);
  fs.copySync(CONTRACTS_DIR, FRONTEND_OUTPUT_DIR, { overwrite: true });
}

export function storeContractAddress(name: string, address: string) {
  let addresses: any;
  if (!fs.pathExistsSync(CONTRACT_ADDRESS_FILE)) addresses = {};
  else addresses = JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_FILE, "utf8"));

  addresses[name] = address;

  fs.writeFileSync(
    CONTRACT_ADDRESS_FILE,
    JSON.stringify(addresses, null, 2),
    "utf8"
  );
}

export function getContract(name: string) {
  const address = getContractAddress(name);
  return ethers.getContractAt(name, address);
}

export function getContractAddress(name: string): string {
  if (!fs.pathExistsSync(CONTRACT_ADDRESS_FILE))
    throw new Error("Deployed contracts address file not found");

  return JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_FILE, "utf8"))[name];
}

export async function getSignerByIndex(idx: number) {
  return ethers.getSigners().then((accounts) => accounts[idx]);
}

export async function incrementBlocks(nBlocks: number) {
  for (let i = 0; i < nBlocks; i++) {
    await network.provider.send("evm_mine");
  }
  console.log(`Incremented ${nBlocks} blocks`);
}

// proposals

export function getLastProposalId(chaindId: string) {
  if (!fs.pathExistsSync(PROPOSALS_FILE))
    throw new Error("Proposals file not found");

  const proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"));

  if (!proposals[chaindId]) throw new Error("No proposals for this network");

  return proposals[chaindId].at(-1);
}

export function storeProposalId(proposalId: string, chainId: string) {
  let proposals: any;
  if (!fs.pathExistsSync(PROPOSALS_FILE)) proposals = {};
  else proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"));

  if (!proposals[chainId]) proposals[chainId] = [];

  proposals[chainId].push(proposalId);

  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2), "utf8");
}
