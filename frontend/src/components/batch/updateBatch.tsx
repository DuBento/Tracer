"use client";

import { SupplyChain } from "@/contracts";
import BlockchainServices, {
  BatchId,
  PartialUpdate,
} from "@/services/BlockchainServices";
import { useContext } from "react";
import { BatchContext } from "@/context/batchContext";
import NotificationContext from "@/context/notificationContext";
import { ethers } from "ethers";

const UpdateBatch = ({}) => {
  const { batch } = useContext(BatchContext);
  const notifications = useContext(NotificationContext);

  const formSubmit = (e: React.FormEvent | React.MouseEvent, method: any) => {
    e.preventDefault();
    method();
  };

  const handlePushNewEvent = async (
    id: BatchId,
    partialEvent: PartialUpdate
  ) => {
    try {
      await BlockchainServices.pushNewUpdate(id, partialEvent);
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
