"use client";

import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import BlockchainServices from "@/services/BlockchainServices";
import { ethers } from "ethers";
import { useContext, useState } from "react";

const GetBatch = ({}) => {
  const [batchId, setBatchId] = useState<string>("");
  const { batch, setBatch } = useContext(BatchContext);

  const notifications = useContext(NotificationContext);

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  const handleFetchBatch = async (id: ethers.BigNumberish) => {
    try {
      setBatch(await BlockchainServices.getBatch(id));
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
    }
  };

  return (
    <>
      <h3>Get Batch</h3>
      <form onSubmit={(e) => formSubmit(e, () => handleFetchBatch(batchId))}>
        <label htmlFor="fid">Batch id:</label>
        <input
          type="text"
          id="fid"
          name="fid"
          onChange={(e) => setBatchId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {batch && <p>{JSON.stringify(batch)}</p>}
    </>
  );
};

export default GetBatch;
