import { useEffect, useState } from "react";
import SupplyChainView from "@/views/SupplychainView";
import BlockchainServices from "@/services/BlockchainServices";

const SupplychainController = () => {
  const [data, setData] = useState<object>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setData(await BlockchainServices.getBatch(1));
  };

  return data ? <SupplyChainView value={data} /> : <p>Batch not loaded</p>;
};

export default SupplychainController;
