import { ethers } from "ethers";
import { Traceability } from "../artifacts-frontend/typechain";
import { NewBatchEvent } from "../artifacts-frontend/typechain/Traceability/Traceability";

export async function newBatch(
  traceability: Traceability,
  description: string,
  documentURI?: string
) {
  const tx = await traceability.newBatch(description, documentURI || "");
  const receipt = await tx.wait();

  if (receipt == null) throw new Error("Error completing transaction");

  const newBatchEvent = (
    receipt.logs.find(
      (event) =>
        event instanceof ethers.EventLog && event.eventName == "NewBatch"
    ) as NewBatchEvent.Log
  )?.args;

  const batchId = newBatchEvent.id;
  const gasUsed = receipt.gasUsed;

  return { batchId, gasUsed };
}
