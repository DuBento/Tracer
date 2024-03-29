import base64url from "base64url";
import { BigNumberish, ethers } from "ethers";
import Traceability, { Batch, BatchId, Update } from "./traceability";
import UserRegistry from "./userRegistry";

const BATCH_URI_DELIMITER = "@";

export type BatchLog = {
  batchId: BatchId;
  currentOwnerName: string;
  currentOwnerAddress: string;
  state: string;
  warning: boolean;
  batchDescription: string;
  contractDescription: string;
  managerName: string;
  managerInfo: string;
  managerAddress: string;
  requiredTransactionAttributesKeys: string[];
  log: BatchEventLog[];
};

export type BatchEventLog = {
  actorName: string;
  actorAddress: string;
  receivingDate?: string;
  receivingTime?: string;
  events: BatchEvent[];
};

export type BatchEvent = {
  isTransaction: boolean;
  transactionAttributes?: string[];
  ts: bigint;
  date: string;
  time: string;
  documentURI: string;
};

const Utils = {
  parseTime: (ts: bigint): string => {
    const date = new Date(Number(ts * 1000n));
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  parseDate: (ts: bigint): string => {
    const date = new Date(Number(ts * 1000n));
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  },

  parseBatchState: (
    state: number | bigint,
  ): { stateDescription: string; warning: boolean } => {
    if (typeof state == "bigint") state = Number(state);
    switch (state) {
      case 0:
        return { stateDescription: "Functioning", warning: false };
      case 1:
        return {
          stateDescription: "Corrective Measures Needed",
          warning: true,
        };
      case 2:
        return {
          stateDescription: "Waiting Review of Corrective Measures",
          warning: true,
        };
      default:
        return { stateDescription: "Unknown", warning: true };
    }
  },

  encodeBatchURI: (id: BatchId | string, contractAddress: string): string => {
    if (typeof id === "string") id = BigInt(id);

    const idHex = id.toString(16); // Convert BigInt to hexadecimal string
    const encodedID = base64url.encode(idHex, "hex");

    const contractAddressHex = contractAddress.replace("0x", "");
    const encodedContractAddress = base64url.encode(contractAddressHex, "hex");

    return `${encodedID}${BATCH_URI_DELIMITER}${encodedContractAddress}`;
  },

  decodeBatchURI: (
    encodedText: string,
  ): { batchId: BatchId; contractAddress: string } => {
    const encodedParts = encodedText.split(BATCH_URI_DELIMITER);
    if (encodedParts.length !== 2) throw new Error("Invalid encoded batch URL");

    const [batchIdEncoded, contractAddressEncoded] = encodedParts;

    const batchIdHex = base64url.decode(batchIdEncoded, "hex"); // Decode and get the hexadecimal string
    const contractAddressBytes = base64url.decode(
      contractAddressEncoded,
      "hex",
    );

    // Parse the hexadecimal string as a BigInt
    const batchId = BigInt(`0x${batchIdHex}`);

    return {
      batchId,
      contractAddress: ethers.getAddress(`0x${contractAddressBytes}`),
    };
  },

  getInvolvedActors: (batch: Batch, updates: Update[]): Set<string> => {
    const actors = new Set<string>();

    actors.add(batch.currentOwner);

    updates.forEach((update) => {
      actors.add(update.owner);
    });

    batch.transactions.forEach((transaction) => {
      actors.add(transaction.receiver);
    });

    return actors;
  },

  getActorNamesMemoized: async (
    batch: Batch,
    updates: Update[],
  ): Promise<Map<string, string>> => {
    const actorNamesMap = new Map<string, string>();
    const actorAddresses = Utils.getInvolvedActors(batch, updates);

    for (const address of actorAddresses) {
      if (address in actorNamesMap) continue;
      actorNamesMap.set(address, await UserRegistry.getActorName(address));
    }

    return actorNamesMap;
  },

  getBatchLog: async (
    contractAddress: string,
    batchId: BigNumberish,
  ): Promise<BatchLog | undefined> => {
    const batch = await Traceability.getBatch(contractAddress, batchId);
    if (!batch.id) return undefined;

    const updates = await Traceability.getUpdates(contractAddress, batchId);

    const managerAddress =
      await Traceability.getContractManagerAddress(contractAddress);
    const member = await UserRegistry.getMember(managerAddress);

    const contractDescription =
      await Traceability.getContractDescription(contractAddress);

    const requiredTransactionAttributesKeys =
      await Traceability.getRequiredTransactionAttributesKeys(contractAddress);

    const actorNamesMap = await Utils.getActorNamesMemoized(batch, updates);
    const { stateDescription, warning } = Utils.parseBatchState(batch.state);

    const eventLog: BatchEventLog[] = [];
    let actor = batch.transactions[0].receiver;

    for (const transaction of batch.transactions) {
      const transactionUpdateIdx = updates.findLastIndex(
        (update) => update.owner == actor,
      );
      const transactionUpdate = updates[transactionUpdateIdx];
      updates.splice(transactionUpdateIdx, 1);

      const event = {
        isTransaction: true,
        transactionAttributes: transaction.additionalAttributesValues,
        ts: transactionUpdate!.ts,
        date: Utils.parseDate(transactionUpdate!.ts),
        time: Utils.parseTime(transactionUpdate!.ts),
        documentURI: transactionUpdate!.documentURI,
      };

      const existingActorEventLog = eventLog.find(
        (log) => log.actorAddress == transactionUpdate!.owner,
      );
      if (existingActorEventLog == undefined) {
        eventLog.push({
          actorName: actorNamesMap.get(transactionUpdate!.owner) || "Unknown",
          actorAddress: transactionUpdate!.owner,
          events: [event],
        });
      } else {
        existingActorEventLog.events.unshift(event);
      }

      // update receiver date
      const receivingActor = eventLog.find(
        (log) => log.actorAddress == transaction.receiver,
      );
      if (receivingActor == undefined) {
        eventLog.push({
          actorName: actorNamesMap.get(transaction.receiver) || "Unknown",
          actorAddress: transaction.receiver,
          receivingDate: Utils.parseDate(transactionUpdate!.ts),
          receivingTime: Utils.parseTime(transactionUpdate!.ts),
          events: [],
        });
      } else {
        receivingActor.receivingDate = Utils.parseDate(transactionUpdate!.ts);
        receivingActor.receivingTime = Utils.parseTime(transactionUpdate!.ts);
      }

      actor = transaction.receiver;
    }

    for (const update of updates) {
      const event = {
        isTransaction: false,
        ts: update.ts,
        date: Utils.parseDate(update.ts),
        time: Utils.parseTime(update.ts),
        documentURI: update.documentURI,
      };

      let existingActorEventLog = eventLog.find(
        (log) => log.actorAddress == update.owner,
      );
      if (existingActorEventLog == undefined) throw Error("Misformed batch");

      existingActorEventLog.events.unshift(event);
    }

    return {
      batchId: batch.id,
      state: stateDescription,
      warning: warning,
      contractDescription: contractDescription,
      batchDescription: batch.description,
      currentOwnerName: actorNamesMap.get(batch.currentOwner) || "Unknown",
      currentOwnerAddress: batch.currentOwner,
      managerName: member.name,
      managerInfo: member.infoURI,
      managerAddress: managerAddress,
      requiredTransactionAttributesKeys: requiredTransactionAttributesKeys,
      log: eventLog.reverse(),
    };
  },
};

export default Utils;
