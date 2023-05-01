import { useState } from "react";
import SupplyChainView from "@/views/SupplychainView";
import BlockchainServices from "@/services/BlockchainServices";
import { SupplyChain } from "@/contracts";
import { ethers } from "ethers";

const SupplychainController = () => {
  const [batch, setBatch] = useState<SupplyChain.BatchStructOutput>();
  const [error, setError] = useState<String>();

  const handleFetchBatch = async (id: ethers.BigNumberish) => {
    setBatch(await BlockchainServices.getBatch(id));
  };

  const handlePushNewEvent = async (
    id: ethers.BigNumberish,
    partialEvent: Partial<SupplyChain.EventStruct>
  ) => {
    try {
      await BlockchainServices.pushNewEvent(id, partialEvent);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  if (error) return <>{error}</>;

  return (
    <SupplyChainView
      batch={batch}
      handleFetchBatch={handleFetchBatch}
      handlePushNewEvent={handlePushNewEvent}
    />
  );
};

export default SupplychainController;
