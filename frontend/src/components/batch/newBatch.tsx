"use client";

import BlockchainServices from "@/services/BlockchainServices";
import { ethers } from "ethers";
import { useState } from "react";

const NewBatch = ({}) => {
  const [batchId, setBatchId] = useState<string>();
  const [newBatchDescription, setNewBatchDescription] = useState("");

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  const handleCreateNewBatch = async (
    description: string,
    documentHash: string
  ) => {
    try {
      const newBatchId = await BlockchainServices.newBatch(
        description,
        documentHash
      );
      setBatchId(newBatchId.toString());
    } catch (error: any) {
      console.error(error);
      // TODO use provider default error function
    }
  };

  return (
    <>
      <h3>New Batch</h3>
      <form
        onSubmit={(e) =>
          formSubmit(e, () =>
            handleCreateNewBatch(
              newBatchDescription,
              ethers.utils.formatBytes32String("Event document test hash")
            )
          )
        }
      >
        <label htmlFor="fdescription">Batch description:</label>
        <input
          type="text"
          id="fdescription"
          name="fdescription"
          onChange={(e) => setNewBatchDescription(e.target.value)}
        />
        <br />
        <label htmlFor="fdescription">Batch documentHash TODO changable </label>
        <input
          type="text"
          id="fdescription"
          name="fdescription"
          value={ethers.utils.formatBytes32String("Event document test hash")}
          readOnly
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {batchId && <p>{batchId.toString()}</p>}
    </>
  );
};

export default NewBatch;
