import { ethers, Signer, BrowserProvider } from "ethers";

import {
  address as supplyChainAddress,
  abi as supplyChainAbi,
} from "../../../abi/SupplyChain.json";

export var signer: Signer | null = null;
export var provider: BrowserProvider;

export const connectWallet = async () => {
  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed so are
    // only have read-only access
    console.error("MetaMask not installed; TODO");
    // provider = ethers.getDefaultProvider();
    // TODO
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();

    console.log({ provider, signer });
  }
};
