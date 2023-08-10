import Image from "next/image";
import React, { useEffect, useState } from "react";

interface FilePreviewProps {
  file: File;
  close?: (file: File) => void;
}

const FilePreview = ({ file, close }: FilePreviewProps) => {
  const [filePreview, setFilePreview] = useState<JSX.Element>();

  useEffect(() => {
    if (file.type.includes("image")) {
      setFilePreview(
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="max-h-full rounded-lg object-cover"
        />,
      );
    } else if (file.type.includes("text")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Display the beginning of the text
        const truncatedText = text.slice(0, 900);
        setFilePreview(
          <p className="max-h-full max-w-full overflow-hidden text-ellipsis whitespace-normal break-words text-gray-400">
            {truncatedText}
          </p>,
        );
      };
      reader.readAsText(file);
    } else if (file.type.includes("video")) {
      setFilePreview(
        <video
          className="aspect-video overflow-hidden rounded-lg"
          loop
          controls
          muted
        >
          <source src={URL.createObjectURL(file)} />
        </video>,
      );
    } else {
      // Placeholder for other file types
      setFilePreview(
        <div className="max-w-full overflow-hidden text-ellipsis p-2 text-center font-mono font-bold text-bluegray-500">
          <svg
            className="m-auto h-16 w-16"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          </svg>
          <p>{file.type.split("/").pop()?.toUpperCase()}</p>
        </div>,
      );
    }
  }, [file]);

  useEffect(() => () => cleanup());

  function cleanup() {
    // Clean up the object URL created for the image preview
    if (file.type.includes("image")) {
      URL.revokeObjectURL(filePreview?.props?.src);
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg bg-bluegray-200 p-4">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-gray-500">
          {file.name}
        </p>
        {close && (
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={() => {
              cleanup();
              close(file);
            }}
          >
            <svg
              className="h-4 w-4 cursor-pointer fill-current stroke-2 text-gray-500"
              viewBox="0 0 24 24"
            >
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
        )}
      </div>
      <div className="relative my-2 flex h-full items-center justify-center overflow-hidden text-gray-400">
        {filePreview}
      </div>
    </div>
  );
};

export default FilePreview;
