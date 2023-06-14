import { BigNumber, BigNumberish, ethers } from "ethers";

import { SupplyChain__factory, SupplyChain } from "@/contracts/";
import { NewBatchEventObject } from "@/contracts/SupplyChain";
import SupplyChainSCConfig from "@/contracts/SupplyChain.json";
import { PromiseOrValue } from "@/contracts/common";
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

  getBatch: async (id: BatchId): Promise<Batch> => {
    return BlockchainServices.supplyChainContract().then((contract) =>
      contract.getBatch(id)
    );
  },

  newBatch: async (
    description: string,
    documentURI: string
  ): Promise<BatchId> => {
    return BlockchainServices.supplyChainContract().then(async (contract) => {
      const tx = await contract.newBatch(description, documentURI);
      const receipt = await tx.wait();

      const newBatchEvent = receipt.events?.find(
        (event) => event.event == "NewBatch"
      )?.args as unknown as NewBatchEventObject;

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
        if (!ethers.utils.isAddress(receiver))
          throw new Error("No receiver associated with transaction");

        console.log("Sending transaction:");
        console.log({ id, receiver, documentURI });

        return contract.handleTransaction(id, receiver, documentURI);
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

  parseTime: (bigNumberish: PromiseOrValue<BigNumberish>): string => {
    return new Date(
      BigNumber.from(bigNumberish).toNumber() * 1000
    ).toISOString();
  },
};

export default BlockchainServices;
