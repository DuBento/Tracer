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

const UpdateBatch = (props: Props) => {
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const notifications = useContext(NotificationContext);

  const handlePushNewEvent = async () => {
    if (!props.batchId) throw new Error("No batch to be updated");
    if (!updateDescription && files.length == 0)
      throw new Error("No files or description provided");

    return StorageService.uploadDocuments(
      updateDescription,
      files,
      props.contractAddress,
      props.batchId.toString(),
    )
      .then((URI) =>
        BlockchainServices.Traceability.pushNewUpdate(
          props.contractAddress,
          props.batchId!,
          URI,
        ),
      )
      .then(() => {
        setUpdateDescription("");
        setFiles([]);
      });
  };

  const handlePushNewEventNotify = async () => {
    notifications.notifyPromise(handlePushNewEvent(), {
      loading: "Pushing new event...",
      success: "New event pushed",
      error: (err) => {
        console.error(err);
        return `${err}`;
      },
    });
  };

  if (!props.batchId) return null;

  return (
    <>
      <div>
        <h2 className="font-mono text-2xl font-bold">Push new event</h2>

        <p className="text-base leading-6">Update description</p>
        <div className="my-2 ">
          <textarea
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
          onClick={handlePushNewEventNotify}
        >
          Push new update
        </button>
      </div>
    </>
  );
};

export default UpdateBatch;
