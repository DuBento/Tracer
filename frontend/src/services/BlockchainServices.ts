import { ethers, Contract, providers } from "ethers";

// import {
//   SupplyChain,
//   SupplyChain__factory,
// } from "../../../blockchain/typechain-types";
import SupplyChainSCConfig from "../../../abi/SupplyChain.json";

const supplyChainAddress = SupplyChainSCConfig.address;
const supplyChainAbi = SupplyChainSCConfig.abi;

const connectWallet = (): providers.JsonRpcProvider => {
  if (window?.ethereum == null) {
    //   // If MetaMask is not installed, we use the default provider,
    //   // which is backed by a variety of third-party services (such
    //   // as INFURA). They do not have private keys installed so are
    //   // only have read-only access
    throw new Error("MetaMask not installed; TODO");
    //   // provider = ethers.getDefaultProvider();
    //   // TODO
  } else {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    // await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    // const signer = provider.getSigner()
    return provider;
  }
};

const connectHardhat = async () => {
  // If no %%url%% is provided, it connects to the default
  // http://localhost:8545, which most nodes use.
  const jsonRpcProvider = new ethers.providers.JsonRpcProvider();
  return jsonRpcProvider;
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
