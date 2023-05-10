"use client";

import { SupplyChain } from "@/contracts";
import { createContext, useState } from "react";

interface BatchContextType {
  batch?: SupplyChain.BatchStructOutput;
  setBatch: (newBatch: SupplyChain.BatchStructOutput) => void;
}

export const BatchContext = createContext<BatchContextType>({
  batch: undefined,
  setBatch: () => {},
});

export default function BatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [batch, setBatch] = useState<SupplyChain.BatchStructOutput>();

  return (
    <BatchContext.Provider value={{ batch, setBatch }}>
      {children}
    </BatchContext.Provider>
  );
}
