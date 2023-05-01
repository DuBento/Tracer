import { SupplyChain } from "@/contracts";
import { ethers } from "ethers";
import { useState } from "react";

type SupplychainViewProps = {
  batch?: SupplyChain.BatchStructOutput;
  handleFetchBatch: (id: ethers.BigNumberish) => void;
  handlePushNewEvent: (
    id: ethers.BigNumberish,
    event: Partial<SupplyChain.EventStruct>
  ) => void;
};

const SupplychainView = ({
  batch,
  handleFetchBatch,
  handlePushNewEvent,
}: SupplychainViewProps) => {
  const [batchId, setBatchId] = useState("");

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  return (
    <>
      <div>
        <h3>Get Batch</h3>
        <form onSubmit={(e) => formSubmit(e, () => handleFetchBatch(batchId))}>
          <label htmlFor="fid">Batch id:</label>
          <input
            type="text"
            id="fid"
            name="fid"
            onChange={(e) => setBatchId(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        {batch && <p>{JSON.stringify(batch)}</p>}
      </div>
      {batch && (
        <div>
          <h3>Push new event</h3>
          <button
            onClick={(e) =>
              formSubmit(e, () =>
                handlePushNewEvent(batch.id, {
                  documentHash: ethers.utils.formatBytes32String(
                    "Event document test hash"
                  ),
                })
              )
            }
          >
            Push new update
          </button>
        </div>
      )}
    </>
  );
};

export default SupplychainView;
