import { EventLog, ethers } from "ethers";

import { SupplyChain, SupplyChain__factory } from "@/contracts/";
import SupplyChainSCConfig from "@/contracts/SupplyChain.json";
import { NewBatchEvent } from "@/contracts/supplychain/SupplyChain";
const supplyChainAddress = SupplyChainSCConfig.address;

let supplyChainContract: SupplyChain | undefined = undefined;

// Types

export type Batch = SupplyChain.BatchStructOutput;
export type BatchId = ethers.BigNumberish;

export type Update = SupplyChain.UpdateStructOutput;
export type PartialUpdate = Partial<Update>;

export type Transaction = SupplyChain.TransactionStructOutput;
export type PartialTransaction = Partial<Transaction> & {
  info?: PartialUpdate;
};

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
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    const signer = await provider.getSigner();
    return signer;
  }
};

const connectHardhat = async () => {
  // If no %%url%% is provided, it connects to the default
  // http://localhost:8545, which most nodes use.
  const jsonRpcProvider = new ethers.JsonRpcProvider();
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

  getBatch: async (id: BatchId): Promise<Batch> => {
    return BlockchainServices.supplyChainContract().then((contract) =>
      contract.getBatch(id)
    );
  },

  newBatch: async (description: string): Promise<BatchId> => {
    return BlockchainServices.supplyChainContract().then(async (contract) => {
      const tx = await contract.newBatch(description);
      const receipt = await tx.wait();

      if (receipt == null) throw new Error("Error completing transaction");

      const newBatchEvent = (
        receipt.logs.find(
          (event) => event instanceof EventLog && event.eventName == "NewBatch"
        ) as NewBatchEvent.Log
      )?.args;

      return newBatchEvent.id;
    });
  },

  pushNewUpdate: async (id: BatchId, documentURI: string) => {
    return await BlockchainServices.supplyChainContract().then(
      async (contract) => {
        console.log("Sending:");
        console.log({ id, documentURI });

        const tx = await contract.handleUpdate(id, documentURI);
        tx.wait();
      }
    );
  },

  pushNewTransaction: async (
    id: BatchId,
    receiver: string,
    documentURI: string
  ) => {
    return await BlockchainServices.supplyChainContract().then(
      async (contract) => {
        if (!ethers.isAddress(receiver))
          throw new Error("No receiver associated with transaction");

        console.log("Sending transaction:");
        console.log({ id, receiver, documentURI });

        const tx = await contract.handleTransaction(id, receiver, documentURI);
        tx.wait();
      }
    );
  },

  listenOnNewBatchEvent: async () => {
    BlockchainServices.supplyChainContract().then(
      async (contract: SupplyChain) => {
        const currentAddress = await contract.getAddress();
        const filter = contract.filters.NewBatch(currentAddress);

        contract.on(filter, (owner, id, event) => {
          console.log(
            `#Listening: New Bacth event with id: ${owner}. Owner is ${id}.`
          );
        });
      }
    );
  },

  parseTime: (ts: bigint): string => {
    return new Date(Number(ts * 1000n)).toISOString();
  },
};

export default BlockchainServices;
