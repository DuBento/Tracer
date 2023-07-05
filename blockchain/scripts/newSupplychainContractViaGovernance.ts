import { newSupplychainContractViaGovernance } from "../lib/newSupplychainContractViaGovernance";

newSupplychainContractViaGovernance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
