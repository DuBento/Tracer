import { SupplyChain } from "@/contracts";
import { ethers } from "ethers";
import { useState } from "react";

type SupplychainViewProps = {
  batch?: SupplyChain.BatchStructOutput;
  handleCreateNewBatch: (description: string, documentHash: string) => void;
  handleFetchBatch: (id: ethers.BigNumberish) => void;
  handlePushNewEvent: (
    id: ethers.BigNumberish,
    event: Partial<SupplyChain.EventStruct>
  ) => void;
};

const SupplychainView = ({
  batch,
  handleCreateNewBatch,
  handleFetchBatch,
  handlePushNewEvent,
}: SupplychainViewProps) => {
  const [batchId, setBatchId] = useState("");
  const [newBatchDescription, setNewBatchDescription] = useState("");

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  return (
    <>
      <div>
        <h3>New Batch</h3>
        <form
          onSubmit={(e) =>
            formSubmit(e, () =>
              handleCreateNewBatch(
                newBatchDescription,
                ethers.utils.formatBytes32String("Event document test hash")
              )
            )
          }
        >
          <label htmlFor="fdescription">Batch description:</label>
          <input
            type="text"
            id="fdescription"
            name="fdescription"
            onChange={(e) => setNewBatchDescription(e.target.value)}
          />
          <br />
          <label htmlFor="fdescription">
            Batch documentHash TODO changable{" "}
          </label>
          <input
            type="text"
            id="fdescription"
            name="fdescription"
            value={ethers.utils.formatBytes32String("Event document test hash")}
            readOnly
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
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
