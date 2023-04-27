import { ethers, Contract } from "ethers";

// import {
//   SupplyChain,
//   SupplyChain__factory,
// } from "../../../blockchain/typechain-types";
import SupplyChainSCConfig from "../../../abi/SupplyChain.json";

const supplyChainAddress = SupplyChainSCConfig.address;
const supplyChainAbi = SupplyChainSCConfig.abi;

const connectWallet = (): ethers.JsonRpcApiProvider => {
  if (window?.ethereum == null) {
    //   // If MetaMask is not installed, we use the default provider,
    //   // which is backed by a variety of third-party services (such
    //   // as INFURA). They do not have private keys installed so are
    //   // only have read-only access
    throw new Error("MetaMask not installed; TODO");
    //   // provider = ethers.getDefaultProvider();
    //   // TODO
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    const browserProvider = new ethers.BrowserProvider(window?.ethereum);
    return browserProvider.provider;

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    // signer = await browserProvider.getSigner();
  }
};

const connectHardhat = async () => {
  // If no %%url%% is provided, it connects to the default
  // http://localhost:8545, which most nodes use.
  const jsonRpcProvider = new ethers.JsonRpcProvider();
  return jsonRpcProvider.provider;
};

interface BlockchainServicesInterface {
  // provider: ethers.JsonRpcApiProvider;
  supplyChainContract: () => ethers.Contract;
  ping: () => Promise<string>;
  getBatch: (id: number) => Promise<object>;
}

const BlockchainServices: BlockchainServicesInterface = {
  // provider: connectWallet(),

  supplyChainContract: () =>
    new Contract(supplyChainAddress, supplyChainAbi, connectWallet()),

  ping: async (): Promise<string> => {
    return BlockchainServices.supplyChainContract().ping();
  },

  getBatch: async (id: number): Promise<object> => {
    return BlockchainServices.supplyChainContract().getBatch(id);
  },
};

export default BlockchainServices;
