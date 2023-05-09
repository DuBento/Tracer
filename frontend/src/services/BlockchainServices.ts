import { BigNumber, ethers, providers } from "ethers";

import { SupplyChain__factory, SupplyChain } from "@/contracts/";
import SupplyChainSCConfig from "@/contracts/SupplyChain.json";
import { NewBatchEvent, NewBatchEventObject } from "@/contracts/SupplyChain";

const supplyChainAddress = SupplyChainSCConfig.address;

let supplyChainContract: SupplyChain | undefined = undefined;

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
  supplyChainContract: async (): Promise<SupplyChain> => {
    if (supplyChainContract) return supplyChainContract;
    else {
      supplyChainContract = SupplyChain__factory.connect(
        supplyChainAddress,
        await connectWallet()
      );
      return supplyChainContract;
    }
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

  newBatch: async (description: string, hash: string): Promise<BigNumber> => {
    return BlockchainServices.supplyChainContract().then(async (contract) => {
      const tx = await contract.newBatch(description, hash);
      const receipt = await tx.wait();

      const newBatchEvent = receipt.events?.find(
        (event) => event.event == "NewBatch"
      )?.args as unknown as NewBatchEventObject;

      return newBatchEvent.id;
    });
  },

  pushNewEvent: async (
    id: ethers.BigNumberish,
    partialEvent: Partial<SupplyChain.EventStruct>
  ) => {
    return await BlockchainServices.supplyChainContract().then(
      async (contract) => {
        const currentAddress = await contract.signer.getAddress();
        partialEvent.owner = currentAddress;
        partialEvent.ts = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
        partialEvent.eventType = 1;

        const event = partialEvent as SupplyChain.EventStruct;

        console.log("Sending:");
        console.log({ id, event });

        return contract.handleEvent(id, event);
      }
    );
  },

  listenOnNewBatchEvent: async () => {
    BlockchainServices.supplyChainContract().then(
      async (contract: SupplyChain) => {
        const currentAddress = await contract.signer.getAddress();
        const filter = contract.filters.NewBatch(currentAddress);

        contract.on(filter, (owner, id, event) => {
          console.log(
            `#Listening: New Bacth event with id: ${owner}. Owner is ${id}.`
          );
        });
      }
    );
  },
};

export default BlockchainServices;
