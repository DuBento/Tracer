"use client";

import { formSubmit } from "@/app/batch/page";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import { ethers } from "ethers";
import { useContext, useState } from "react";

const NewBatch = ({}) => {
  const notifications = useContext(NotificationContext);

  const [batchId, setBatchId] = useState<string>();
  const [newBatchDescription, setNewBatchDescription] = useState("");
  const [document, setDocument] = useState(
    "QmYiBNWbsTJ6zjBzfav962PZz9GEXF2GcTE1hsd4xazA2B"
  );

  const handleCreateNewBatch = async (
    description: string,
    documentURI: string
  ) => {
    try {
      const newBatchId = await BlockchainServices.newBatch(
        description,
        documentURI
      );
      notifications.notify(newBatchId.toString());
      setBatchId(newBatchId.toString());
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-">New Batch</h2>
      <form
        onSubmit={(e) =>
          formSubmit(e, () =>
            handleCreateNewBatch(newBatchDescription, document)
          )
        }
      >
        <label htmlFor="fdescription" className="text-base leading-6">
          Batch description
        </label>
        <div className="my-2 ">
          <input
            id="fdescription"
            name="fdescription"
            type="text"
            autoComplete="off"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
            onChange={(e) => setNewBatchDescription(e.target.value)}
          />
        </div>
        <label htmlFor="fdocument" className="text-base leading-6">
          Batch documentURI TODO
        </label>
        <div className="my-2 ">
          <input
            id="fdocument"
            name="fdocument"
            type="text"
            autoComplete="off"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </div>
        <button
          className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
          type="submit"
        >
          Submit
        </button>
      </form>

      {batchId && (
        <p className="text-base font-semibold font-sans">
          {batchId.toString()}
        </p>
      )}
    </>
  );
};

export default NewBatch;
