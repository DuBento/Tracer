"use client";

import TracerAPI from "@/TracerAPI";
import ChangeContractAddress from "@/components/batch/changeContractAddress";
import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import Transaction from "@/components/batch/transaction";
import UpdateBatch from "@/components/batch/updateBatch";

import { useState } from "react";

const ManagementPage = () => {
  const [batchId, setBatchId] = useState<string>();
  const [contractAddress, setContractAddress] = useState<string>(
    TracerAPI.getContractAddress("mockTraceabilityContract"),
  );

  const defaultBatchId = TracerAPI.getContractAddress("mockBatchId");

  return (
    <main className="relative h-screen w-full overflow-auto bg-khaki px-8 py-4 text-oxford_blue">
      <div className="absolute right-0 top-0 pr-7 pt-7">
        <ChangeContractAddress {...{ contractAddress, setContractAddress }} />
      </div>
      <div className="w-full border-b-2 border-redwood p-2">
        <NewBatch contractAddress={contractAddress} />
      </div>
      <div className="w-full p-2">
        <GetBatch
          {...{ batchId, setBatchId, contractAddress }}
          initialBatchId={defaultBatchId}
        />
        {batchId && (
          <>
            <div className="mx-10 border-b-2 border-redwood py-2">
              <UpdateBatch
                batchId={batchId}
                contractAddress={contractAddress}
              />
            </div>
            <div className="mx-10 py-2">
              <Transaction
                batchId={batchId}
                contractAddress={contractAddress}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ManagementPage;
