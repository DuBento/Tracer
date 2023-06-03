"use client";

import { BatchContext } from "@/context/batchContext";
import BlockchainServices, {
  Transaction,
  Update,
} from "@/services/BlockchainServices";
import { useContext } from "react";

const DisplayBatch = ({}) => {
  const { batch, setBatch } = useContext(BatchContext);

  function stringifyEthersResult(obj: any, level = 0): string[] {
    let res: string[] = [];
    const whitespace = "\t".repeat(level);
    for (const key of Object.keys(obj)) {
      if (!Number.isInteger(Number(key))) {
        if (Array.isArray(obj[key])) {
          let nestedResult;
          if (
            Object.keys(obj[key]).every((key) => Number.isInteger(Number(key)))
          )
            nestedResult = obj[key].flatMap((v: any) =>
              stringifyEthersResult(v, level + 2).concat(
                `${"\t".repeat(level + 2)}---`
              )
            );
          else nestedResult = stringifyEthersResult(obj[key], level + 2);
          res.push(`${whitespace}${key}:`, ...nestedResult);
        } else res.push(`${whitespace}${key}: ${obj[key]}`);
      }
    }
    return res;
  }

  function displayUpdate(update: Update, idx: number) {
    return (
      <div key={idx}>
        <p className="text-base font-semibold font-sans whitespace-pre">
          Onwer: {update.owner.toString()}
        </p>
        <p className="text-base font-semibold font-sans whitespace-pre">
          documentURI: {update.documentURI.toString()}
        </p>
        <p className="text-base font-semibold font-sans whitespace-pre">
          Ts: {BlockchainServices.parseTime(update.ts)}
        </p>
      </div>
    );
  }

  function displayTransaction(transaction: Transaction, idx: number) {
    return (
      <div key={idx}>
        <p className="text-base font-semibold font-sans whitespace-pre">
          Receiver: {transaction.receiver.toString()}
        </p>
        <p className="text-base font-semibold font-sans whitespace-pre">
          Info:
        </p>
        <div className="p-2">{displayUpdate(transaction.info, idx)}</div>
      </div>
    );
  }

  return (
    <>
      {batch && (
        <>
          <div>
            <p className="text-base font-semibold font-sans whitespace-pre">
              ID: {batch.id.toString()}
            </p>
            <p className="text-base font-semibold font-sans whitespace-pre">
              Description: {batch.description}
            </p>
            <p className="text-base font-semibold font-sans whitespace-pre">
              Current Onwer: {batch.currentOwner}
            </p>
            <p className="text-base font-semibold font-sans whitespace-pre">
              Current State: {batch.state}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-base font-semibold font-sans whitespace-pre">
              Updates:
            </p>
            <div className="flex-col">{batch.updates.map(displayUpdate)}</div>
          </div>

          <div className="pt-4">
            <p className="text-base font-semibold font-sans whitespace-pre">
              Transactions:
            </p>
            <div className="flex-col">
              {batch.transactions.map(displayTransaction)}
            </div>
          </div>

          {/* 
          {stringifyEthersResult(batch).map((val, idx) => (
            <p
              className="text-base font-semibold font-sans whitespace-pre"
              key={idx}
            >
              {val}
            </p>
          ))} */}
        </>
      )}
    </>
  );
};

export default DisplayBatch;
