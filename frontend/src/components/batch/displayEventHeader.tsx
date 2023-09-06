"use client";
import { BatchEventLog } from "@/TracerAPI";

interface Props {
  batchEventLog: BatchEventLog;
}
export default function DisplayEventHeader(props: Props) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M13.707 8.707a1 1 0 0 0-1.414-1.414L8 10.586 6.707 9.293a1 1 0 1 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l5-5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-blue-500">Event</p>
        <p className="text-sm text-gray-900">Receiver</p>
        <p className="text-xs text-gray-500">Owner:</p>
        <p className="text-xs text-gray-500">Ts:</p>
      </div>
    </div>
  );
}
