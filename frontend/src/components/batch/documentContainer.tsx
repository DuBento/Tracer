"use client";

import StorageService from "@/services/StorageService";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";

interface DocumentContainerProps {
  uri: string;
}

const DocumentContainer = ({ uri }: DocumentContainerProps) => {
  const { data, error, isLoading } = useSWR(uri, StorageService.fetchDocument);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  // render data
  return (
    <>
      <p className="text-xs text-gray-500">{data}</p>
    </>
  );
};

export default DocumentContainer;
