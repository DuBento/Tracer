import { ethers } from "ethers";
import { Traceability } from "../artifacts-frontend/typechain";
import { NewBatchEvent } from "../artifacts-frontend/typechain/Traceability/Traceability";

export async function newBatch(
  Traceability: Traceability,
  description: string,
  documentURI?: string
): Promise<bigint> {
  const startTime = performance.now();
  const tx = await Traceability.newBatch(description, documentURI || "");
  const txTime = performance.now();
  const receipt = await tx.wait();
  const receiptTime = performance.now();

  console.log(`Tx time: ${txTime - startTime} ms`);
  console.log(`Receipt time: ${receiptTime - txTime} ms`);

  if (receipt == null) throw new Error("Error completing transaction");

  console.log({ receipt });
  console.log({ logs: receipt.logs });

  const newBatchEvent = (
    receipt.logs.find(
      (event) =>
        event instanceof ethers.EventLog && event.eventName == "NewBatch"
    ) as NewBatchEvent.Log
  )?.args;

  return newBatchEvent.id;
}
