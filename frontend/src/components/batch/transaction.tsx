"use client";

import TracerAPI, { BatchId } from "@/TracerAPI";
import NotificationContext from "@/context/notificationContext";
import StorageService from "@/services/StorageService";
import { useContext, useEffect, useState } from "react";
import FilesDropzone from "../common/filesDropzone";

interface Props {
  batchId?: BatchId;
  contractAddress: string;
}

const Transaction = (props: Props) => {
  const [requiredAttributesKeys, setRequiredAttributesKeys] =
    useState<string[]>();
  const [requiredAttributes, setRequiredAttributes] = useState<string[]>([]);
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const notifications = useContext(NotificationContext);

  useEffect(() => {
    TracerAPI.Traceability.getRequiredTransactionAttributesKeys(
      props.contractAddress,
    )
      .then((attributes) => {
        setRequiredAttributesKeys(attributes);
        setRequiredAttributes(attributes.map((_) => ""));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSendTransaction = async () => {
    if (!props.batchId) throw new Error("No batch to be updated");
    if (!receiverAddress) throw new Error("No receiver address provided");
    if (!updateDescription && files.length == 0)
      throw new Error("No files or description provided");
    if (requiredAttributes.some((str) => str === ""))
      throw new Error("Missing required attributes");

    return StorageService.uploadDocuments(
      updateDescription,
      files,
      props.contractAddress,
      props.batchId.toString(),
    )
      .then((URI) =>
        TracerAPI.Traceability.pushNewTransaction(
          props.contractAddress,
          props.batchId!,
          receiverAddress,
          URI,
          requiredAttributes,
        ),
      )
      .then(() => {
        setReceiverAddress("");
        setUpdateDescription("");
        setRequiredAttributes(requiredAttributes.map((_) => ""));
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

      {requiredAttributesKeys?.map((attribute, idx) => (
        <div key={idx}>
          <p className="text-base leading-6">
            {attribute.replace(/\w/, (c) => c.toUpperCase())}
          </p>
          <div className="my-2 ">
            <input
              id={`${attribute}-${idx}`}
              name={`${attribute}-${idx}`}
              autoComplete="off"
              required
              className="block w-full rounded-md border-0 bg-platinum 
                py-1.5 text-gray-700 shadow ring-inset placeholder:text-gray-400
                focus:ring-2 focus:ring-inset focus:ring-brown_sugar sm:text-sm sm:leading-6"
              onChange={(e) => {
                const updatedAttributes = [...requiredAttributes];
                updatedAttributes[idx] = e.target.value;
                setRequiredAttributes(updatedAttributes);
              }}
              value={requiredAttributes[idx]}
            />
          </div>
        </div>
      ))}

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
