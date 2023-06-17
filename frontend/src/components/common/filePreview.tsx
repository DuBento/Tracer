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
          className="object-cover max-h-full rounded-lg"
        />
      );
    } else if (file.type.includes("text")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Display the beginning of the text
        const truncatedText = text.slice(0, 900);
        setFilePreview(
          <p className="max-h-full max-w-full overflow-hidden whitespace-normal break-words text-ellipsis text-gray-400">
            {truncatedText}
          </p>
        );
      };
      reader.readAsText(file);
    } else if (file.type.includes("video")) {
      setFilePreview(
        <video
          className="aspect-video rounded-lg overflow-hidden"
          loop
          controls
          muted
        >
          <source src={URL.createObjectURL(file)} />
        </video>
      );
    } else {
      // Placeholder for other file types
      setFilePreview(
        <div className="text-center p-2 text-bluegray-500 font-mono font-bold max-w-full text-ellipsis overflow-hidden">
          <svg
            className="h-16 w-16 m-auto"
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
        </div>
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
    <div className="flex flex-col justify-between bg-bluegray-200 p-4 rounded-lg w-full h-full">
      <div className="flex flex-row justify-between items-center w-full">
        <p className="font-mono text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
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
              className="w-4 h-4 stroke-2 fill-current text-gray-500 cursor-pointer"
              viewBox="0 0 24 24"
            >
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
        )}
      </div>
      <div className="relative flex justify-center items-center h-full my-2 overflow-hidden text-gray-400">
        {filePreview}
      </div>
    </div>
  );
};

export default FilePreview;
