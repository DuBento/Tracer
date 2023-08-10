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
  supplyChainContract: async (address: string): Promise<Supplychain> =>
    Supplychain__factory.connect(address, await connectWallet()),

  getBatch: async (contractAddress: string, id: BatchId): Promise<Batch> => {
    return BlockchainServices.supplyChainContract(contractAddress).then(
      (contract) => contract.getBatch(id),
    );
  },

  newBatch: async (
    contractAddress: string,
    description: string,
  ): Promise<BatchId> => {
    return BlockchainServices.supplyChainContract(contractAddress).then(
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
    return await BlockchainServices.supplyChainContract(contractAddress).then(
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
    return await BlockchainServices.supplyChainContract(contractAddress).then(
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

  listenOnNewBatchEvent: async (contractAddress: string) => {
    BlockchainServices.supplyChainContract(contractAddress).then(
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
      contractAddress: base64url.decode(contractAddressEncoded, "hex"),
    };
  },
};

export default BlockchainServices;
