import { getNamedAccounts } from "hardhat";
import { newMemberViaGovernance } from "../lib/newMemberViaGovernance";
import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";

async function newMemberAndSupplychainContract() {
  const { supplychainManager } = await getNamedAccounts();

  const { member } = await newMemberViaGovernance(supplychainManager);

  return await newSupplychainContractViaGovernance(supplychainManager);
}

newMemberAndSupplychainContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
