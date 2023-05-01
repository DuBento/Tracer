import { ethers, providers } from "ethers";

import { SupplyChain__factory, SupplyChain } from "@/contracts/";
import SupplyChainSCConfig from "@/contracts/SupplyChain.json";

const supplyChainAddress = SupplyChainSCConfig.address;

const connectWallet = async (): Promise<ethers.Signer> => {
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
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();
    return signer;
  }
};

const connectHardhat = async () => {
  // If no %%url%% is provided, it connects to the default
  // http://localhost:8545, which most nodes use.
  const jsonRpcProvider = new ethers.providers.JsonRpcProvider();
  return jsonRpcProvider;
};

const BlockchainServices = {
  // provider: connectWallet(),

  supplyChainContract: async (): Promise<SupplyChain> => {
    const signer = await connectWallet();
    return SupplyChain__factory.connect(supplyChainAddress, signer);
  },

  ping: async (): Promise<string> => {
    return BlockchainServices.supplyChainContract().then((contract) =>
      contract.ping()
    );
  },

  getBatch: async (
    id: ethers.BigNumberish
  ): Promise<SupplyChain.BatchStructOutput> => {
    return BlockchainServices.supplyChainContract().then((contract) =>
      contract.getBatch(id)
    );
  },

  pushNewEvent: async (
    id: ethers.BigNumberish,
    partialEvent: Partial<SupplyChain.EventStruct>
  ) => {
    partialEvent.owner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    partialEvent.ts = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
    partialEvent.eventType = 1;

    const event = partialEvent as SupplyChain.EventStruct;

    console.log("Sending:");
    console.log({ id, event });

    const res = await BlockchainServices.supplyChainContract().then(
      (contract) => contract.handleEvent(id, event)
    );

    console.log({ res });
  },
};

export default BlockchainServices;
