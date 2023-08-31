"use client";

import TracerAPI, { Batch } from "@/TracerAPI";
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
  contractAddress: TracerAPI.deployedAddresses["mockTraceabilityContract"],
  setContractAddress: () => {},
});

export default function BatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [batch, setBatch] = useState<Batch>();
  const [contractAddress, setContractAddress] = useState<string>(
    TracerAPI.deployedAddresses["mockTraceabilityContract"],
  );

  return (
    <BatchContext.Provider
      value={{ batch, setBatch, contractAddress, setContractAddress }}
    >
      {children}
    </BatchContext.Provider>
  );
}
