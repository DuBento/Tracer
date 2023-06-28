import { getSignerByIndex } from "./scripts/utils";

export const developmentChains = ["hardhat", "localhost"];

// governor contract
export const MIN_DELAY = 3600; // 1 hour
export const VOTING_DELAY = 1; // 1 block
export const VOTING_PERIOD = 50400; // 1 week
export const VOTING_QUORUM = 4; // porcentage

export const SUPPLYCHAIN_CREATE_METHOD = "create";
export const SUPPLYCHAIN_CREATE_MANAGER_SIGNER_PROMISE = getSignerByIndex(1);
export const SUPPLYCHAIN_CREATE_PROPOSAL_DESCRIPTION =
  "Create a new supplychain contract";
