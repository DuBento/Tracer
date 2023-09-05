import { ethers } from "ethers";
import { Supplychain } from "../artifacts-frontend/typechain";
import { NewBatchEvent } from "../artifacts-frontend/typechain/supplychain/Supplychain";

export async function newBatch(
  supplyChain: Supplychain,
  description: string,
  documentURI?: string
): Promise<bigint> {
  const tx = await supplyChain.newBatch(description, documentURI || "");
  const receipt = await tx.wait();

  if (receipt == null) throw new Error("Error completing transaction");

  const newBatchEvent = (
    receipt.logs.find(
      (event) =>
        event instanceof ethers.EventLog && event.eventName == "NewBatch"
    ) as NewBatchEvent.Log
  )?.args;

  return newBatchEvent.id;
}
