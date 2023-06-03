import { ethers } from "hardhat";

// Constants
export const BATCH_DESCRIPTION = "Batch test description";
export const UPDATE_DOCUMENT_URI = ethers.utils.formatBytes32String(
  "Event document test hash"
);

export const tsNow = () => ethers.BigNumber.from(Math.floor(Date.now() / 1000));
