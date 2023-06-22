import { ethers } from "hardhat";

// Constants
export const BATCH_DESCRIPTION = "Batch test description";
export const UPDATE_DOCUMENT_URI = ethers.encodeBytes32String(
  "Event document test hash"
);

export const tsNow = () => BigInt(Math.floor(Date.now() / 1000));
