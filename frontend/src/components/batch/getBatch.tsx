"use client";

import { formSubmit } from "@/app/batch/page";
import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices, {
  Batch,
  BatchId,
} from "@/services/BlockchainServices";
import { useContext, useEffect, useState } from "react";
import DisplayBatch from "./displayBatch";

const GetBatch = ({}) => {
  const [batchId, setBatchId] = useState<string>("");
  const { batch, setBatch } = useContext(BatchContext);

  const notifications = useContext(NotificationContext);

  const handleFetchBatch = async (id: BatchId) => {
    try {
      setBatch(await BlockchainServices.getBatch(id));
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
    }
  };

  useEffect(() => {
    if (!batch) return;
    console.log(batch);
  }, [batch]);

  return (
    <>
      <h2 className="text-2xl font-mono ">Get Batch</h2>
      <form onSubmit={(e) => formSubmit(e, () => handleFetchBatch(batchId))}>
        <label htmlFor="fid" className="text-base leading-6">
          Batch id
        </label>
        <div className="mt-2">
          <input
            id="fid"
            name="fid"
            type="text"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
            onChange={(e) => setBatchId(e.target.value)}
          />
        </div>

        <button
          className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
          type="submit"
        >
          Submit
        </button>
      </form>
      <DisplayBatch />
    </>
  );
};

export default GetBatch;
