"use client";

import { SupplyChain } from "@/contracts";
import BlockchainServices from "@/services/BlockchainServices";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import { BatchContext } from "@/context/batchContext";

const UpdateBatch = ({}) => {
  const batchContext = useContext(BatchContext);
  const batch = batchContext?.batch;

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  const handlePushNewEvent = async (
    id: ethers.BigNumberish,
    partialEvent: Partial<SupplyChain.EventStruct>
  ) => {
    try {
      await BlockchainServices.pushNewEvent(id, partialEvent);
    } catch (error: any) {
      console.error(error);
      // TODO use provider default error function
    }
  };

  return (
    <>
      {batch && (
        <div>
          <h3>Push new event</h3>
          <button
            onClick={(e) =>
              formSubmit(e, () =>
                handlePushNewEvent(batch.id, {
                  documentHash: ethers.utils.formatBytes32String(
                    "Event document test hash"
                  ),
                })
              )
            }
          >
            Push new update
          </button>
        </div>
      )}
    </>
  );
};

export default UpdateBatch;
