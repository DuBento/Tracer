"use client";

import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import StorageService from "@/services/StorageService";
import { useContext, useState } from "react";
import FilesDropzone from "../common/filesDropzone";

const UpdateBatch = ({}) => {
  const { batch } = useContext(BatchContext);
  const notifications = useContext(NotificationContext);

  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const handlePushNewEvent = async () => {
    if (batch === undefined) throw new Error("No batch to be updated");
    if (!updateDescription && files.length == 0)
      throw new Error("No files or description provided");

    return StorageService.uploadDocuments(updateDescription, files)
      .then((URI) => BlockchainServices.pushNewUpdate(batch.id, URI))
      .then(() => {
        setUpdateDescription("");
        setFiles([]);
      });
  };

  const handlePushNewEventNotify = async () => {
    notifications.notifyPromise(handlePushNewEvent(), {
      loading: "Pushing new event...",
      success: "New event pushed",
      error: (err) => `${err}`,
    });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-mono">Push new event</h2>

        <p className="text-base leading-6">Update description</p>
        <div className="my-2 ">
          <textarea
            autoComplete="off"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <FilesDropzone fileArray={files} setFileArray={setFiles} />
        </div>

        <button
          className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
          onClick={handlePushNewEventNotify}
        >
          Push new update
        </button>
      </div>
    </>
  );
};

export default UpdateBatch;
