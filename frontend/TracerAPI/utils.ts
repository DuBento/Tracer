import base64url from "base64url";
import { BigNumberish, ethers } from "ethers";
import Traceability, {
  Batch,
  BatchId,
  Transaction,
  Update,
} from "./traceability";
import UserRegistry from "./userRegistry";

const BATCH_URI_DELIMITER = "@";

export type HumanReadableBatch = Omit<Batch, "updates" | "transactions"> & {
  currentOwnerName: string;
  updates: HumanReadableUpdate[];
  transactions: HumanReadableTransaction[];
};
export type HumanReadableTransaction = Omit<Transaction, "info"> & {
  receiverName: string;
  info: HumanReadableUpdate;
};
export type HumanReadableUpdate = Update & {
  ownerName: string;
  date: string;
  time: string;
};

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
  ts: bigint;
  date: string;
  time: string;
  documentURI: string;
};

const Utils = {
  parseTime: (ts: bigint): string => {
    const date = new Date(Number(ts * 1000n));
    return `${date.getHours()}:${date.getMinutes()}`;
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
    if (typeof id == "string") id = BigInt(id);
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

  getActorNamesMemoized: async (batch: Batch): Promise<Map<string, string>> => {
    const actorNamesMap = new Map<string, string>();
    const actorAddresses = Utils.getInvolvedActors(batch);

    for (const address of actorAddresses) {
      if (address in actorNamesMap) continue;
      actorNamesMap.set(address, await UserRegistry.getActorName(address));
    }

    return actorNamesMap;
  },

  humanizeBatch: async (batch: Batch): Promise<HumanReadableBatch> => {
    const actorNamesMap = await Utils.getActorNamesMemoized(batch);

    return {
      ...batch,
      currentOwner: actorNamesMap.get(batch.currentOwner) || "Unknown",
      updates: batch.updates.map((update) => ({
        ...update,
        ownerName: actorNamesMap.get(update.owner) || "Unknown",
        date: "TODO parse date",
        time: "TODO parse time",
      })),
      transactions: batch.transactions.map((transaction) => ({
        ...transaction,
        receiverName: actorNamesMap.get(transaction.receiver) || "Unknown",
        info: {
          ...transaction.info,
          owner: actorNamesMap.get(transaction.info.owner) || "Unknown",
          date: "TODO parse date",
          time: "TODO parse time",
        },
      })),
    };
  },

  getBatchLog: async (
    contractAddress: string,
    batchId: BigNumberish,
  ): Promise<BatchLog | undefined> => {
    const batch = await Traceability.getBatch(contractAddress, batchId);
    if (!batch.id) return undefined;

    const managerAddress =
      await Traceability.getContractManagerAddress(contractAddress);
    const member = await UserRegistry.getMember(managerAddress);

    const contractDescription =
      await Traceability.getContractDescription(contractAddress);

    const actorNamesMap = await Utils.getActorNamesMemoized(batch);
    const { stateDescription, warning } = Utils.parseBatchState(batch.state);

    const eventLog: BatchEventLog[] = [];
    for (const update of batch.updates) {
      const event = {
        isTransaction: false,
        ts: update.ts,
        date: Utils.parseDate(update.ts),
        time: Utils.parseTime(update.ts),
        documentURI: update.documentURI,
      };

      const existingActorEventLog = eventLog.find(
        (log) => log.actorAddress == update.owner,
      );
      if (existingActorEventLog == undefined) {
        eventLog.push({
          actorName: actorNamesMap.get(update.owner) || "Unknown",
          actorAddress: update.owner,
          events: [event],
        });
      } else {
        existingActorEventLog.events.push(event);
      }
    }

    for (const transaction of batch.transactions) {
      const event = {
        isTransaction: true,
        ts: transaction.info.ts,
        date: Utils.parseDate(transaction.info.ts),
        time: Utils.parseTime(transaction.info.ts),
        documentURI: transaction.info.documentURI,
      };

      const existingActorEventLog = eventLog.find(
        (log) => log.actorAddress == transaction.info.owner,
      );
      if (existingActorEventLog == undefined) throw Error("Misformed batch");

      existingActorEventLog.events.push(event);

      // update receiver date
      const receiverActorLog = eventLog.find(
        (log) => log.actorAddress == transaction.receiver,
      );
      if (receiverActorLog) {
        receiverActorLog.receivingDate = Utils.parseDate(transaction.info.ts);
        receiverActorLog.receivingTime = Utils.parseTime(transaction.info.ts);
      }
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
      log: eventLog.reverse(),
    };
  },
};

export default Utils;
