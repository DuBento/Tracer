"use client";

import TracerAPI from "@/TracerAPI";
import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import Transaction from "@/components/batch/transaction";
import UpdateBatch from "@/components/batch/updateBatch";

import { useState } from "react";

const ManagementPage = () => {
  const [batchId, setBatchId] = useState<string>();
  const [contractAddress, setContractAddress] = useState<string>(
    TracerAPI.deployedAddresses["mockTraceabilityContract"],
  );

  const defaultBatchId = TracerAPI.deployedAddresses["mockBatchId"];

  return (
    <main className="h-screen w-full overflow-auto bg-bluegray-600 px-8 py-4  text-cyan-50">
      <div className="w-full border-b-2 border-red-100 p-2">
        <NewBatch contractAddress={contractAddress} />
      </div>
      <div className="w-full p-2">
        <GetBatch
          {...{ batchId, setBatchId, contractAddress }}
          initialBatchId={defaultBatchId}
        />
        {batchId && (
          <>
            <div className="mx-10 border-b-2  border-red-100 py-2">
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
