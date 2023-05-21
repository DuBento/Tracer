"use client";

import { Batch } from "@/services/BlockchainServices";
import { createContext, useState } from "react";

interface BatchContextType {
  batch?: Batch;
  setBatch: (newBatch: Batch) => void;
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
  const [batch, setBatch] = useState<Batch>();

  return (
    <BatchContext.Provider value={{ batch, setBatch }}>
      {children}
    </BatchContext.Provider>
  );
}
