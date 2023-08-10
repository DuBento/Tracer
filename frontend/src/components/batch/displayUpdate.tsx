import BlockchainServices, { Update } from "@/services/BlockchainServices";
import { useState } from "react";
import DocumentContainer from "./documentContainer";

interface DisplayUpdateProps {
  update: Update;
}
const DisplayUpdate = ({ update }: DisplayUpdateProps) => {
  const [showDocument, setShowDocument] = useState(false);

  const toggleInfo = () => {
    setShowDocument(!showDocument);
  };

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-green-500"
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
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-green-500">Owner</p>
        <p className="text-sm text-gray-900">{update.owner.toString()}</p>
        <p className="text-xs text-gray-500">
          Ts: {BlockchainServices.parseTime(update.ts)}
        </p>
        {update.documentURI && (
          <>
            <button
              className="text-xs text-gray-500 underline"
              onClick={() => toggleInfo()}
            >
              Show Document
            </button>
            {showDocument && (
              <div className="text-xs text-gray-500">
                <DocumentContainer uri={update.documentURI} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayUpdate;
