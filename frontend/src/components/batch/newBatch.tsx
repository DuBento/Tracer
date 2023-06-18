"use client";

import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import { useContext, useState } from "react";

const NewBatch = ({}) => {
  const notifications = useContext(NotificationContext);

  const [batchId, setBatchId] = useState<string>();
  const [newBatchDescription, setNewBatchDescription] = useState("");

  const handleCreateNewBatch = async () => {
    if (!newBatchDescription) throw new Error("Batch description is empty");

    const newBatchId = await BlockchainServices.newBatch(newBatchDescription);
    setBatchId(newBatchId.toString());
  };

  const handleCreateNewBatchNotify = async () => {
    notifications.notifyPromise(handleCreateNewBatch(), {
      loading: "Creating new batch...",
      success: "New batch created",
      error: (err) => `${err}`,
    });
  };

  return (
    <>
      <h2 className="text-2xl font-">New Batch</h2>
      <p className="text-base leading-6">Batch description</p>
      <div className="my-2 ">
        <input
          type="text"
          autoComplete="off"
          className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
          value={newBatchDescription}
          onChange={(e) => setNewBatchDescription(e.target.value)}
        />
      </div>
      <button
        className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
        onClick={handleCreateNewBatchNotify}
      >
        Submit
      </button>

      {batchId && (
        <p className="text-base font-semibold font-sans">
          {batchId.toString()}
        </p>
      )}
    </>
  );
};

export default NewBatch;
