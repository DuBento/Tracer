"use client";

import GetBatch from "@/components/batch/getBatch";
import NewBatch from "@/components/batch/newBatch";
import Transaction from "@/components/batch/transaction";
import UpdateBatch from "@/components/batch/updateBatch";
import deployedAddresses from "@/contracts/deployedAddresses.json";
import { Batch } from "@/services/BlockchainServices";

import { useState } from "react";

const ManagementPage = () => {
  const [batch, setBatch] = useState<Batch>();
  const [contractAddress, setContractAddress] = useState<string>(
    deployedAddresses["testSupplychain"],
  );

  return (
    <main className="h-screen w-full overflow-auto bg-bluegray-600 px-8 py-4  text-cyan-50">
      <div className="w-full border-b-2 border-red-100 p-2">
        <NewBatch contractAddress={contractAddress} />
      </div>
      <div className="w-full p-2">
        <GetBatch {...{ batch, setBatch, contractAddress }}>
          <div className="mx-10 border-b-2  border-red-100 py-2">
            <UpdateBatch
              batchId={batch?.id}
              contractAddress={contractAddress}
            />
          </div>
          <div className="mx-10 py-2">
            <Transaction
              batchId={batch?.id}
              contractAddress={contractAddress}
            />
          </div>
        </GetBatch>
      </div>
    </main>
  );
};

export default ManagementPage;
