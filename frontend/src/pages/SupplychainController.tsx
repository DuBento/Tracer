import { useEffect, useState } from "react";
import SupplyChainView from "@/views/SupplychainView";
import BlockchainServices from "@/services/BlockchainServices";
import { SupplyChain } from "@/contracts";

const SupplychainController = () => {
  const [data, setData] = useState<SupplyChain.BatchStructOutput>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setData(await BlockchainServices.getBatch(1));
  };

  return data ? (
    <SupplyChainView description={data.description} />
  ) : (
    <p>Batch not loaded</p>
  );
};

export default SupplychainController;
