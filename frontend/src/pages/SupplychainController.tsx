import { useEffect, useState } from "react";
import SupplyChainView from "@/views/SupplychainView";
import BlockchainServices from "@/services/BlockchainServices";

const SupplychainController = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    setData(await BlockchainServices.ping());
  };

  return <SupplyChainView value={data} />;
};

export default SupplychainController;
