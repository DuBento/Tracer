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
    } else {
      // Placeholder for other file types
      setFilePreview(<p>Preview not available</p>);
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
    <div className="flex flex-col bg-bluegray-200 p-4 rounded-lg w-full h-full">
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
      <div className="relative h-full my-2 overflow-hidden text-gray-400">
        {filePreview}
      </div>
    </div>
  );
};

export default FilePreview;
