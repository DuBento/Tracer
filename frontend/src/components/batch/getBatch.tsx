"use client";

import NotificationContext from "@/context/notificationContext";
import BlockchainServices, { Batch } from "@/services/BlockchainServices";
import { useContext, useState } from "react";
import DisplayBatch from "./displayBatch";
import QRCode from "./qrcode";

interface Props {
  batch?: Batch;
  setBatch: (newBatch: Batch) => void;
  contractAddress: string;
  children?: React.ReactNode;
}

const tmpDevBatchId =
  "86908536660999850864466637729736991726033624077462134270947258110704485629459";

const GetBatch = (props: Props) => {
  const [batchId, setBatchId] = useState<string>(
    props.batch?.id ? props.batch.id.toString() : tmpDevBatchId,
  );

  const notifications = useContext(NotificationContext);

  const handleFetchBatch = async () => {
    try {
      const batch = await BlockchainServices.getBatch(
        props.contractAddress,
        batchId,
      );
      if (!batch.id) throw new Error("Batch not found.");

      props.setBatch(batch);
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
    }
  };

  return (
    <>
      <div className="my-2 flex h-40 w-full flex-row justify-between gap-6">
        <div className="flex-grow">
          <h2 className="font-mono text-2xl ">Get Batch</h2>
          <p className="text-base leading-6">Batch id</p>
          <div className="mt-2">
            <input
              id="fid"
              name="fid"
              type="text"
              autoComplete="fBatchId"
              value={batchId}
              className="block w-full rounded-md border-0 bg-coolgray-500 
              py-1.5 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <button
            className="wfont-bold mt-4 rounded bg-red-300 px-2 py-1.5 hover:bg-red-200 hover:font-extrabold hover:text-white"
            type="submit"
            onClick={handleFetchBatch}
          >
            Submit
          </button>
        </div>
        {props.batch && (
          <div className="w-56">
            <QRCode
              batch={props.batch}
              contractAddress={props.contractAddress}
            />
          </div>
        )}
      </div>
      {props.batch && (
        <>
          <DisplayBatch batch={props.batch} />
          {props.children}
        </>
      )}
    </>
  );
};

export default GetBatch;
