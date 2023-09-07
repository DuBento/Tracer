"use client";

import BlockchainServices, { BatchId } from "@/TracerAPI";
import NotificationContext from "@/context/notificationContext";
import StorageService from "@/services/StorageService";
import { useContext, useState } from "react";
import FilesDropzone from "../common/filesDropzone";

interface Props {
  batchId?: BatchId;
  contractAddress: string;
}

const Transaction = (props: Props) => {
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const notifications = useContext(NotificationContext);

  const handleSendTransaction = async () => {
    if (!props.batchId) throw new Error("No batch to be updated");
    if (!receiverAddress) throw new Error("No receiver address provided");
    if (!updateDescription && files.length == 0)
      throw new Error("No files or description provided");

    return StorageService.uploadDocuments(updateDescription, files)
      .then((URI) =>
        BlockchainServices.Traceability.pushNewTransaction(
          props.contractAddress,
          props.batchId!,
          receiverAddress,
          URI,
        ),
      )
      .then(() => {
        setReceiverAddress("");
        setUpdateDescription("");
        setFiles([]);
      });
  };

  const handleSendTransactionNotify = async () => {
    notifications.notifyPromise(handleSendTransaction(), {
      loading: "Pushing new transaction...",
      success: "New transaction pushed",
      error: (err) => {
        console.error(err);
        return `${err}`;
      },
    });
  };

  if (!props.batchId) return null;

  return (
    <>
      <h2 className="font-mono text-2xl font-bold">Send to</h2>

      <p className="text-base leading-6">Receiver</p>
      <div className="my-2">
        <input
          id="fid"
          name="fid"
          type="text"
          autoComplete="transactionReceiver"
          className="block w-full rounded-md border-0 bg-platinum 
              py-1.5 text-gray-700 shadow ring-inset placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-brown_sugar sm:text-sm sm:leading-6"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
      </div>

      <p className="text-base leading-6">Update description</p>
      <div className="my-2 ">
        <textarea
          id="fUpdtDocument"
          name="fUpdtDocument"
          autoComplete="off"
          className="block w-full rounded-md border-0 bg-platinum 
              py-1.5 text-gray-700 shadow ring-inset placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-brown_sugar sm:text-sm sm:leading-6"
          value={updateDescription}
          onChange={(e) => setUpdateDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <FilesDropzone fileArray={files} setFileArray={setFiles} />
      </div>

      <button
        className="my-4 rounded bg-redwood px-2 py-1.5 font-bold text-white hover:bg-bole hover:font-extrabold"
        type="submit"
        onClick={handleSendTransactionNotify}
      >
        Submit
      </button>
    </>
  );
};

export default Transaction;
