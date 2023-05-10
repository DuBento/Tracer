"use client";

import { SupplyChain } from "@/contracts";
import BlockchainServices from "@/services/BlockchainServices";
import { ethers } from "ethers";
import { useContext } from "react";
import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";

const UpdateBatch = ({}) => {
  const { batch } = useContext(BatchContext);
  const notifications = useContext(NotificationContext);

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
      notifications.notify("New event pushed");
    } catch (error: any) {
      console.error(error);
      notifications.error(error.message);
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
