"use client";

import BlockchainServices, {
  Batch,
  PartialTransaction,
} from "@/services/BlockchainServices";
import { useContext, useState } from "react";
import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import { formSubmit } from "@/app/batch/page";
import { ethers } from "ethers";

const Transaction = ({}) => {
  const { batch } = useContext(BatchContext);
  const notifications = useContext(NotificationContext);

  const [address, setAddress] = useState<string>();
  const [document, setDocument] = useState<string>(
    ethers.utils.formatBytes32String("Transaction document test hash")
  );

  const handleSendTransaction = async (
    batch: Batch | undefined,
    partialTransaction: PartialTransaction
  ) => {
    try {
      if (batch === undefined) throw new Error("No batch to be updated");
      await BlockchainServices.pushNewTransaction(batch.id, partialTransaction);
      notifications.notify("New transaction submitted");
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-mono ">Send to</h2>
      <form
        onSubmit={(e) =>
          formSubmit(e, () =>
            handleSendTransaction(batch, {
              receiver: address,
              info: { documentHash: document },
            })
          )
        }
      >
        <label htmlFor="fid" className="text-base leading-6">
          Receiver address
        </label>
        <div className="my-2">
          <input
            id="fid"
            name="fid"
            type="text"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <label htmlFor="fid" className="text-base leading-6">
          Document
        </label>
        <div className="my-2 ">
          <input
            id="ftxdocument"
            name="ftxdocument"
            type="text"
            className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-500 placeholder:text-gray-400
              sm:text-sm sm:leading-6"
            value={document}
            disabled
          />
        </div>

        <button
          className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Transaction;
