import { getNamedAccounts } from "hardhat";
import { newMemberViaGovernance } from "../lib/newMemberViaGovernance";

async function newMemberFromNamedAccounts() {
  const { supplychainManager } = await getNamedAccounts();
  return newMemberViaGovernance(supplychainManager);
}

newMemberFromNamedAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
