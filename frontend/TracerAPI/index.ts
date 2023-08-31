import deployedAddresses from "./contracts/deployedAddresses.json";
import Governance from "./governance";
import Traceability from "./traceability";
import UserRegistry from "./userRegistry";
import Utils from "./utils";

export * from "./governance";
export * from "./traceability";
export * from "./userRegistry";
export * from "./utils";

const TracerAPI = {
  Traceability,
  Governance,
  UserRegistry,
  Utils,
  deployedAddresses,
};

export default TracerAPI;
