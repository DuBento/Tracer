import { BigNumberish } from "ethers";
import { Traceability } from "../artifacts-frontend/typechain";
import { UpdateEvent } from "../artifacts-frontend/typechain/Traceability/Traceability";

export async function getUpdates(
  traceability: Traceability,
  batchId: BigNumberish
): Promise<UpdateEvent.OutputObject[]> {
  // Query all time for any update
  const filter = traceability.filters.Update(batchId);
  const events = await traceability.queryFilter(filter);

  return events.map((event) => event.args);
}
