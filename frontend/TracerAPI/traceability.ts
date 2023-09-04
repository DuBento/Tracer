import {
  Supplychain,
  Supplychain__factory,
} from "@/TracerAPI/contracts/typechain";
import { EventLog, ethers } from "ethers";
import { connectEthereum, connectSigner } from "./connection";
import { NewBatchEvent } from "./contracts/typechain/supplychain/Supplychain";

// Types

export type Batch = Supplychain.BatchStructOutput;
export type BatchId = ethers.BigNumberish;

export type Update = Supplychain.UpdateStructOutput;
export type PartialUpdate = Partial<Update>;

export type Transaction = Supplychain.TransactionStructOutput;
export type PartialTransaction = Partial<Transaction> & {
  info?: PartialUpdate;
};

const Traceability = {
  connect: async (address: string): Promise<Supplychain> =>
    Supplychain__factory.connect(address, await connectSigner()),

  connectReadOnly: async (address: string): Promise<Supplychain> =>
    Supplychain__factory.connect(address, await connectEthereum()),

  // Read only methods
  getContractManagerAddress: async (contractAddress: string): Promise<string> =>
    Traceability.connectReadOnly(contractAddress).then((contract) =>
      contract.getManager(),
    ),

  getContractDescription: async (contractAddress: string): Promise<string> =>
    Traceability.connectReadOnly(contractAddress).then((contract) =>
      contract.getContractDescription(),
    ),

  getBatch: async (contractAddress: string, id: BatchId): Promise<Batch> =>
    Traceability.connectReadOnly(contractAddress).then((contract) =>
      contract.getBatch(id),
    ),

  listenOnNewBatchEvent: async (contractAddress: string) => {
    Traceability.connectReadOnly(contractAddress).then(
      async (contract: Supplychain) => {
        const currentAddress = await contract.getAddress();
        const filter = contract.filters.NewBatch(currentAddress);

        contract.on(filter, (owner, id, event) => {
          console.log(
            `#Listening: New Bacth event with id: ${owner}. Owner is ${id}.`,
          );
        });
      },
    );
  },

  // State changing methods

  newBatch: async (
    contractAddress: string,
    description: string,
  ): Promise<BatchId> =>
    Traceability.connect(contractAddress).then(async (contract) => {
      const tx = await contract.newBatch(description);
      const receipt = await tx.wait();

      if (receipt == null) throw new Error("Error completing transaction");

      const newBatchEvent = (
        receipt.logs.find(
          (event) => event instanceof EventLog && event.eventName == "NewBatch",
        ) as NewBatchEvent.Log
      )?.args;

      return newBatchEvent.id;
    }),

  pushNewUpdate: async (
    contractAddress: string,
    id: BatchId,
    documentURI: string,
  ): Promise<void> =>
    Traceability.connect(contractAddress).then(async (contract) => {
      console.log("Sending:");
      console.log({ id, documentURI });

      const tx = await contract.handleUpdate(id, documentURI);
      tx.wait();
    }),

  pushNewTransaction: async (
    contractAddress: string,
    id: BatchId,
    receiver: string,
    documentURI: string,
  ): Promise<void> =>
    await Traceability.connect(contractAddress).then(async (contract) => {
      if (!ethers.isAddress(receiver))
        throw new Error("No receiver associated with transaction");

      console.log("Sending transaction:");
      console.log({ id, receiver, documentURI });

      const tx = await contract.handleTransaction(id, receiver, documentURI);
      tx.wait();
    }),
};

export default Traceability;
