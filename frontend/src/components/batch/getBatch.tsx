"use client";

import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import { useContext, useEffect, useState } from "react";
import DisplayBatch from "./displayBatch";
import QRCode from "./qrcode";

const GetBatch = () => {
  const [batchId, setBatchId] = useState<string>(
    "109520590170103477010316801948809068559869343391415481457425034871206184730642"
  );
  const { batch, setBatch } = useContext(BatchContext);

  const notifications = useContext(NotificationContext);

  const handleFetchBatch = async () => {
    try {
      setBatch(await BlockchainServices.getBatch(batchId));
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
      <div className="flex flex-row w-full justify-between gap-6 my-2 h-40">
        <div className="flex-grow">
          <h2 className="text-2xl font-mono ">Get Batch</h2>
          <p className="text-base leading-6">Batch id</p>
          <div className="mt-2">
            <input
              id="fid"
              name="fid"
              type="text"
              autoComplete="fBatchId"
              value={batchId}
              className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <button
            className="mt-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
            type="submit"
            onClick={handleFetchBatch}
          >
            Submit
          </button>
        </div>
        {batch && (
          <div className="w-56">
            <QRCode />
          </div>
        )}
      </div>
      <DisplayBatch />
    </>
  );
};

export default GetBatch;
