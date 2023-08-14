import deployedAddresses from "@/contracts/deployedAddresses.json";
import { Supplychain, Supplychain__factory } from "@/contracts/typechain";
import { NewBatchEvent } from "@/contracts/typechain/supplychain/Supplychain";
import base64url from "base64url";
import { EventLog, ethers } from "ethers";
const supplyChainAddress = deployedAddresses["testSupplychain"];

const BATCH_URI_DELIMITER = "@";

// Types

export type Batch = Supplychain.BatchStructOutput;
export type BatchId = ethers.BigNumberish;

export type Update = Supplychain.UpdateStructOutput;
export type PartialUpdate = Partial<Update>;

export type Transaction = Supplychain.TransactionStructOutput;
export type PartialTransaction = Partial<Transaction> & {
  info?: PartialUpdate;
};

const connectEthereum = async (): Promise<ethers.Provider> => {
  // if server side, connects to node
  if (typeof window === "undefined") return connectNode();
  // if client side, connects to wallet
  return connectWallet();
};

const connectNode = async (): Promise<ethers.Provider> => {
  return new ethers.JsonRpcProvider(process.env.ETHEREUM_NODE_URL);
};

const connectWallet = async (): Promise<ethers.BrowserProvider> => {
  if (window.ethereum == null) throw new Error("No web3 wallet connected.");
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask
  return new ethers.BrowserProvider(window.ethereum);
};

const connectSigner = async (): Promise<ethers.Signer> => {
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask
  const provider = await connectWallet();

  // It also provides an opportunity to request access to write
  // operations, which will be performed by the private key
  // that MetaMask manages for the user.
  const signer = await provider.getSigner();
  return signer;
};

const Traceability = {
  traceabilityContract: async (address: string): Promise<Supplychain> =>
    Supplychain__factory.connect(address, await connectSigner()),

  traceabilityContractReadOnly: async (address: string): Promise<Supplychain> =>
    Supplychain__factory.connect(address, await connectEthereum()),

  // Read only methods

  getContractManagerAddress: async (
    contractAddress: string,
  ): Promise<string> => {
    return Traceability.traceabilityContractReadOnly(contractAddress).then(
      (contract) => contract.manager(),
    );
  },

  getBatch: async (contractAddress: string, id: BatchId): Promise<Batch> => {
    return Traceability.traceabilityContractReadOnly(contractAddress).then(
      (contract) => contract.getBatch(id),
    );
  },

  listenOnNewBatchEvent: async (contractAddress: string) => {
    Traceability.traceabilityContractReadOnly(contractAddress).then(
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
  ): Promise<BatchId> => {
    return Traceability.traceabilityContract(contractAddress).then(
      async (contract) => {
        const tx = await contract.newBatch(description);
        const receipt = await tx.wait();

        if (receipt == null) throw new Error("Error completing transaction");

        const newBatchEvent = (
          receipt.logs.find(
            (event) =>
              event instanceof EventLog && event.eventName == "NewBatch",
          ) as NewBatchEvent.Log
        )?.args;

        return newBatchEvent.id;
      },
    );
  },

  pushNewUpdate: async (
    contractAddress: string,
    id: BatchId,
    documentURI: string,
  ) => {
    return await Traceability.traceabilityContract(contractAddress).then(
      async (contract) => {
        console.log("Sending:");
        console.log({ id, documentURI });

        const tx = await contract.handleUpdate(id, documentURI);
        tx.wait();
      },
    );
  },

  pushNewTransaction: async (
    contractAddress: string,
    id: BatchId,
    receiver: string,
    documentURI: string,
  ) => {
    return await Traceability.traceabilityContract(contractAddress).then(
      async (contract) => {
        if (!ethers.isAddress(receiver))
          throw new Error("No receiver associated with transaction");

        console.log("Sending transaction:");
        console.log({ id, receiver, documentURI });

        const tx = await contract.handleTransaction(id, receiver, documentURI);
        tx.wait();
      },
    );
  },
};

const UserRegistry = {
  getMember: async (address: string) => {
    // TODO
  },
};

const Utils = {
  parseTime: (ts: bigint): string => {
    return new Date(Number(ts * 1000n)).toISOString();
  },

  encodeBatchURI: (id: BatchId, contractAddress: string): string => {
    const idBytes = id.toString(16);
    const idBuffer = Buffer.from(idBytes, "hex");

    const contractAddressBytes = contractAddress.replace("0x", "");
    const contractAddressBuffer = Buffer.from(contractAddressBytes, "hex");

    return `${base64url.encode(
      idBuffer,
    )}${BATCH_URI_DELIMITER}${base64url.encode(contractAddressBuffer)}`;
  },

  decodeBatchURI: (
    encodedText: string,
  ): { batchId: BatchId; contractAddress: string } => {
    const encodedParts = encodedText.split(BATCH_URI_DELIMITER);
    if (encodedParts.length != 2) throw new Error("Invalid encoded batch URL");

    const [batchIdEncoded, contractAddressEncoded] = encodedParts;

    return {
      batchId: BigInt(`0x${base64url.decode(batchIdEncoded, "hex")}`),
      contractAddress: ethers.getAddress(
        base64url.decode(contractAddressEncoded, "hex"),
      ),
    };
  },
};

const BlockchainServices = {
  Traceability,
  Utils,
};

export default BlockchainServices;
