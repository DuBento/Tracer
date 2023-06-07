"use client";
import React, { useState } from "react";
import FilePreview from "./filePreview";

interface FilesDropzoneProps {
  fileArray: File[];
  setFileArray: (fileArray: File[]) => void;
}

const FilesDropzone = ({ fileArray, setFileArray }: FilesDropzoneProps) => {
  const [dragging, setDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFileArray(filesArray);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      const draggedFilesArray = Array.from(e.dataTransfer.files);
      setFileArray(fileArray.concat(draggedFilesArray));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const removeFile = (file: File) => {
    setFileArray(fileArray.filter((f) => f !== file));
  };

  return (
    <div
      className={`py-4 px-4 rounded-md ${
        dragging ? "bg-bluegray-200" : "bg-coolgray-100"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`py-2 px-4 border-[2px] border-red-300 border-dotted rounded-lg cursor-pointer
        ${dragging ? "bg-bluegray-200" : "bg-coolgray-100"}`}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          accept="image/*, audio/*, video/*, .xml, .txt, .xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
          onChange={handleFileSelect}
        />
        <div className="flex flex-row space-x-4 items-center">
          <svg
            className="w-8 h-8 text-red-300"
            fill="currentColor"
            viewBox="0 0 102 66"
          >
            <path d="M3 33C1.34315 33 0 34.3431 0 36V41C0 54.8071 11.1929 66 25 66H77C90.8071 66 102 54.8071 102 41V36C102 34.3431 100.657 33 99 33V33C97.3431 33 96 34.3431 96 36V41C96 51.4934 87.4934 60 77 60H25C14.5066 60 6 51.4934 6 41V36C6 34.3431 4.65685 33 3 33V33Z" />
            <path d="M55 3C55 1.34314 53.6568 -1.16692e-06 52 2.98589e-07C50.3431 1.7641e-06 49 1.34315 49 3L55 3ZM49.8787 46.1213C51.0503 47.2929 52.9498 47.2929 54.1214 46.1213L73.2132 27.0294C74.3848 25.8578 74.3848 23.9583 73.2132 22.7868C72.0416 21.6152 70.1421 21.6152 68.9706 22.7868L52 39.7574L35.0294 22.7868C33.8579 21.6152 31.9584 21.6152 30.7868 22.7868C29.6152 23.9584 29.6152 25.8579 30.7868 27.0294L49.8787 46.1213ZM49 3L49 44L55 44L55 3L49 3Z" />
          </svg>

          <p className="text-sm text-gray-500">
            {fileArray.length > 0
              ? `${fileArray.length} file(s) selected`
              : "Drag and drop files here or click to browse"}
          </p>
        </div>
      </div>

      {fileArray.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4 px-4 w-full">
          {fileArray.map((file, index) => (
            <div key={index} className="h-48">
              <FilePreview file={file} close={removeFile} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesDropzone;
