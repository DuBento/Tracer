"use client";

import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/TracerAPI";
import { useContext, useState } from "react";

interface Props {
  contractAddress: string;
}

const NewBatch = (props: Props) => {
  if (!props.contractAddress) throw new Error("Contract address is empty");

  const notifications = useContext(NotificationContext);

  const [batchId, setBatchId] = useState<string>();
  const [newBatchDescription, setNewBatchDescription] = useState("");

  const handleCreateNewBatch = async () => {
    if (!newBatchDescription) throw new Error("Batch description is empty");

    console.log(props.contractAddress);
    const newBatchId = await BlockchainServices.Traceability.newBatch(
      props.contractAddress,
      newBatchDescription,
      "", // TODO: doocument URI support, for now use updates
    );
    setBatchId(newBatchId.toString());
  };

  const handleCreateNewBatchNotify = async () => {
    notifications.notifyPromise(handleCreateNewBatch(), {
      loading: "Creating new batch...",
      success: "New batch created",
    });
  };

  return (
    <>
      <h2 className="font-mono text-2xl font-bold">New Batch</h2>
      <p className="text-base leading-6">Batch description</p>
      <div className="my-2">
        <input
          type="text"
          autoComplete="off"
          className="block w-full rounded-md border-0 bg-platinum 
              py-1.5 text-gray-700 shadow ring-inset placeholder:text-gray-400
              focus:ring-2 focus:ring-inset focus:ring-brown_sugar sm:text-sm sm:leading-6"
          value={newBatchDescription}
          onChange={(e) => setNewBatchDescription(e.target.value)}
        />
      </div>
      <button
        className="my-4 rounded bg-redwood px-2 py-1.5 font-bold text-white hover:bg-bole hover:font-extrabold"
        onClick={handleCreateNewBatchNotify}
      >
        Submit
      </button>

      {batchId && (
        <p className="font-sans text-base font-semibold">
          {batchId.toString()}
        </p>
      )}
    </>
  );
};

export default NewBatch;
