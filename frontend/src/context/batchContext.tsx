"use client";

import deployedAddresses from "@/contracts/deployedAddresses.json";
import { Batch } from "@/services/BlockchainServices";
import { createContext, useState } from "react";

interface BatchContextType {
  batch?: Batch;
  setBatch: (newBatch: Batch) => void;
  contractAddress: string;
  setContractAddress: (newAddress: string) => void;
}

export const BatchContext = createContext<BatchContextType>({
  batch: undefined,
  setBatch: () => {},
  contractAddress: deployedAddresses["testSupplychain"],
  setContractAddress: () => {},
});

export default function BatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [batch, setBatch] = useState<Batch>();
  const [contractAddress, setContractAddress] = useState<string>(
    deployedAddresses["testSupplychain"],
  );

  return (
    <BatchContext.Provider
      value={{ batch, setBatch, contractAddress, setContractAddress }}
    >
      {children}
    </BatchContext.Provider>
  );
}
