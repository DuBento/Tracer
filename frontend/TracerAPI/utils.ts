import base64url from "base64url";
import { ethers } from "ethers";
import {
  Batch,
  BatchId,
  HumanReadableBatch,
  HumanReadableTransaction,
  HumanReadableUpdate,
} from "./traceability";
import UserRegistry from "./userRegistry";

const BATCH_URI_DELIMITER = "@";

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

  getInvolvedActors: (batch: Batch): Set<string> => {
    const actors = new Set<string>();

    actors.add(batch.currentOwner);

    batch.updates.forEach((update) => {
      actors.add(update.owner);
    });

    batch.transactions.forEach((transaction) => {
      actors.add(transaction.receiver);
      actors.add(transaction.info.owner);
    });

    return actors;
  },

  memoizedGetActorNames: async (batch: Batch): Promise<Map<string, string>> => {
    const actorNamesMap = new Map<string, string>();
    const actorAddresses = Utils.getInvolvedActors(batch);

    for (const address of actorAddresses) {
      if (address in actorNamesMap) continue;
      actorNamesMap.set(address, await UserRegistry.getActorName(address));
    }

    return actorNamesMap;
  },

  humanizeBatch: async (batch: Batch): Promise<HumanReadableBatch> => {
    const actorNamesMap = await Utils.memoizedGetActorNames(batch);

    return {
      ...batch,
      currentOwner: actorNamesMap.get(batch.currentOwner) || "Unknown",
      updates: batch.updates.map(
        (update) =>
          ({
            ...update,
            ownerName: actorNamesMap.get(update.owner) || "Unknown",
            date: "TODO parse date",
            time: "TODO parse time",
          }) as HumanReadableUpdate,
      ),
      transactions: batch.transactions.map(
        (transaction) =>
          ({
            ...transaction,
            receiverName: actorNamesMap.get(transaction.receiver) || "Unknown",
            info: {
              ...transaction.info,
              owner: actorNamesMap.get(transaction.info.owner) || "Unknown",
              date: "TODO parse date",
              time: "TODO parse time",
            },
          }) as HumanReadableTransaction,
      ),
    } as HumanReadableBatch;
  },
};

export default Utils;
