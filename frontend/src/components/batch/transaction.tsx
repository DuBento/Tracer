"use client";

import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import StorageService from "@/services/StorageService";
import { useContext, useState } from "react";
import FilesDropzone from "../common/filesDropzone";

const Transaction = ({}) => {
  const { batch } = useContext(BatchContext);
  const notifications = useContext(NotificationContext);

  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSendTransaction = async () => {
    if (batch === undefined) throw new Error("No batch to be updated");
    if (!receiverAddress) throw new Error("No receiver address provided");
    if (!updateDescription && files.length == 0)
      throw new Error("No files or description provided");

    return StorageService.uploadDocuments(updateDescription, files)
      .then((URI) =>
        BlockchainServices.pushNewTransaction(batch.id, receiverAddress, URI),
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
      error: (err) => `${err}`,
    });
  };

  return (
    <>
      <h2 className="font-mono text-2xl ">Send to</h2>

      <p className="text-base leading-6">Receiver</p>
      <div className="my-2">
        <input
          id="fid"
          name="fid"
          type="text"
          autoComplete="transactionReceiver"
          className="block w-full rounded-md border-0 bg-coolgray-500 
              py-1.5 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
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
          className="block w-full rounded-md border-0 bg-coolgray-500 
              py-1.5 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
          value={updateDescription}
          onChange={(e) => setUpdateDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <FilesDropzone fileArray={files} setFileArray={setFiles} />
      </div>

      <button
        className="my-4 rounded bg-red-300 px-2 py-1.5 font-bold hover:bg-red-200 hover:font-extrabold hover:text-white"
        type="submit"
        onClick={handleSendTransactionNotify}
      >
        Submit
      </button>
    </>
  );
};

export default Transaction;
