"use client";
import React, { useRef, useState } from "react";
import FilePreview from "./filePreview";

interface FilesDropzoneProps {
  fileArray: File[];
  setFileArray: (fileArray: File[]) => void;
}

const FilesDropzone = ({ fileArray, setFileArray }: FilesDropzoneProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      className={`rounded-md px-4 py-4 ${
        dragging ? "bg-bluegray-200" : "bg-coolgray-100"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`cursor-pointer rounded-lg border-[2px] border-dotted border-redwood-800 px-4 py-2
        ${dragging ? "bg-bluegray-200" : "bg-coolgray-100"}`}
        onClick={handleFileInputClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*, audio/*, video/*, .xml, .json, .txt, .xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
          onChange={handleFileSelect}
        />
        <div className="flex flex-row items-center space-x-4">
          <svg
            className="h-8 w-8 text-redwood-700"
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
        <div className="mt-4 grid w-full grid-cols-2 gap-2 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
