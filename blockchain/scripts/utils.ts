const fs = require("fs-extra");
const path = require("path");

const contractsDir = path.join(
  __dirname,
  "..",
  "artifacts",
  "frontend-artifacts"
);
const frontendOutDir = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "contracts"
);

const contractAddressesFile = path.join(
  __dirname,
  "..",
  "artifacts",
  "frontend-artifacts",
  "deployedAddresses.json"
);

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

export async function storeContractAddress(name: string, address: string) {
  let addresses: any;
  if (!fs.pathExistsSync(contractAddressesFile)) addresses = {};
  else addresses = JSON.parse(fs.readFileSync(contractAddressesFile, "utf8"));

  fs.ensureFileSync(contractAddressesFile);

  addresses[name] = address;

  fs.writeFileSync(contractAddressesFile, JSON.stringify(addresses), "utf8");
}
