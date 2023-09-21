import { networkName } from "@/properties";
import deployedAddresses from "./contracts/deployedAddresses.json";
import Governance from "./governance";
import Traceability from "./traceability";
import UserRegistry from "./userRegistry";
import Utils from "./utils";

export * from "./governance";
export * from "./traceability";
export * from "./userRegistry";
export * from "./utils";

type DeployedAddressesType = {
  [networkName: string]: {
    [contractName: string]: string;
  };
};
const typedDeployedAddresses = deployedAddresses as DeployedAddressesType;

function getContractAddress(contractName: string): string {
  if (!networkName) {
    throw new Error("Network name not set");
  }
  if (!deployedAddresses[networkName]) {
    throw new Error(`No addresses found for network ${networkName}`);
  }

  const address = typedDeployedAddresses[networkName][contractName];
  if (!address) {
    throw new Error(
      `Contract ${contractName} not found on network ${networkName}`,
    );
  }
  return address;
}

const TracerAPI = {
  Traceability,
  Governance,
  UserRegistry,
  Utils,
  getContractAddress,
};

export default TracerAPI;
