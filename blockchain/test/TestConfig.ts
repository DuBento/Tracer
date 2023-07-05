import { ethers } from "hardhat";

// Constants
export const BATCH_DESCRIPTION = "Batch test description";
export const UPDATE_DOCUMENT_URI = ethers.encodeBytes32String(
  "Event document test hash"
);

export const PROPOSAL_DESCRIPTION = "Proposal test description";
export const PROPOSAL_VOTE_FOR = 1;
export const PROPOSAL_VOTE_DESCRIPTION = "Vote for test proposal";

export const tsNow = () => BigInt(Math.floor(Date.now() / 1000));
