import { FRONTEND_ARTIFACTS_PATH } from "./hardhat.config";
const path = require("path");

export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"];

export const CONTRACTS_DIR = path.join(__dirname, FRONTEND_ARTIFACTS_PATH);
export const FRONTEND_OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "frontend",
  "contracts"
);

export const CONTRACT_ADDRESS_FILE = path.join(
  CONTRACTS_DIR,
  "deployedAddresses.json"
);

export const PROPOSALS_FILE = "proposals.json";

// governor contract
export const MIN_DELAY = 3600; // 1 hour
export const VOTING_DELAY = 1; // 1 block
export const VOTING_PERIOD = 5; // 5 blocks
export const VOTING_QUORUM = 4; // porcentage

export const SUPPLYCHAIN_CREATE_METHOD = "create";
export const SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION =
  "Create a new supplychain contract";
