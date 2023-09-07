"use client";

import BlockchainServices, { BatchLog } from "@/TracerAPI";
import NotificationContext from "@/context/notificationContext";
import { useContext, useState } from "react";
import DisplayBatch from "./displayBatch";
import QRCode from "./qrcode";

interface Props {
  initialBatchId?: string;
  batchId?: string;
  setBatchId: (newId: string) => void;
  contractAddress: string;
}

const GetBatch = (props: Props) => {
  const [batchId, setBatchId] = useState<string>(
    props.batchId || props.initialBatchId || "",
  );
  const [batch, setBatch] = useState<BatchLog>();

  const notifications = useContext(NotificationContext);

  const handleFetchBatch = async () => {
    const batch = await BlockchainServices.Utils.getBatchLog(
      props.contractAddress,
      batchId,
    );
    if (!batch) throw new Error("Batch not found.");

    setBatch(batch);
    props.setBatchId(batch.batchId.toString());
  };

  const handleFetchBatchNotify = async () => {
    notifications.notifyPromise(handleFetchBatch(), {
      loading: "Getting batch...",
      success: "Done",
    });
  };

  return (
    <>
      <div className="my-2 flex h-40 w-full flex-row justify-between gap-6">
        <div className="flex-grow">
          <h2 className="font-mono text-2xl font-bold ">Get Batch</h2>
          <p className="text-base leading-6">Batch id</p>
          <div className="mt-2">
            <input
              id="fid"
              name="fid"
              type="text"
              autoComplete="fBatchId"
              value={batchId}
              placeholder={props.initialBatchId}
              className="block w-full rounded-md border-0 bg-platinum 
              py-1.5 text-gray-700 shadow ring-inset placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-brown_sugar sm:text-sm sm:leading-6"
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <button
            className="my-4 rounded bg-redwood px-2 py-1.5 font-bold text-white hover:bg-bole hover:font-extrabold"
            type="submit"
            onClick={handleFetchBatchNotify}
          >
            Submit
          </button>
        </div>
        {batch && (
          <div className="w-56">
            <QRCode
              batchId={batch.batchId.toString()}
              contractAddress={props.contractAddress}
            />
          </div>
        )}
      </div>
      {batch && (
        <>
          <DisplayBatch batch={batch} />
        </>
      )}
    </>
  );
};

export default GetBatch;
