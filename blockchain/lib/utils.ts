import { deployments, ethers, getChainId, network } from "hardhat";
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

export function storeAddress(
  name: string,
  address: string,
  networkName: string
) {
  let addresses: any;
  if (!fs.pathExistsSync(CONTRACT_ADDRESS_FILE)) addresses = {};
  else addresses = JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_FILE, "utf8"));

  if (!addresses[networkName]) addresses[networkName] = {};
  addresses[networkName][name] = address;

  fs.writeFileSync(
    CONTRACT_ADDRESS_FILE,
    JSON.stringify(addresses, null, 2),
    "utf8"
  );
}

export function getStoredAddress(name: string, networkName: string) {
  if (!fs.pathExistsSync(CONTRACT_ADDRESS_FILE))
    throw new Error("Contract address file not found");

  const addresses = JSON.parse(fs.readFileSync(CONTRACT_ADDRESS_FILE, "utf8"));

  return addresses[networkName][name];
}

export async function getContract<TypedContract>(
  name: string,
  options: { contractAddress?: string; signerAddress?: string } = {}
) {
  let signer = undefined;
  if (options.signerAddress)
    signer = await ethers.getSigner(options.signerAddress);

  let address = options.contractAddress;
  if (!address) address = await getContractAddress(name);

  return ethers.getContractAt(name, address, signer) as TypedContract;
}

export async function getContractAddress(name: string): Promise<string> {
  return (await deployments.get(name)).address;
}

export async function getSignerByIndex(idx: number) {
  return ethers.getSigners().then((accounts) => accounts[idx]);
}

export async function increaseBlocks(nBlocks: number) {
  if ((await getChainId()) === "31337") {
    // hardhat
    await network.provider.send("hardhat_mine", ["0x" + nBlocks.toString(16)]);
  } else {
    // other test networks (ex. ganache)
    for (let i = 0; i < nBlocks; i++) {
      await network.provider.send("evm_mine");
    }
  }
  console.log(`Incremented ${nBlocks} blocks`);
}

export async function increaseTime(seconds: number) {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine");
  console.log(`Time increase by ${seconds} seconds`);
}
// proposals

export async function encodeFunctionCall(
  contractName: string,
  methodName: string,
  args: (string | string[])[]
): Promise<string> {
  const contractFactory = await ethers.getContractFactory(contractName);

  // console.log(`Encoding ${methodName} with args ${args} => on ${contractName}`);
  const encodedFunctionCall = contractFactory.interface.encodeFunctionData(
    methodName,
    args
  );
  return encodedFunctionCall;
}

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
