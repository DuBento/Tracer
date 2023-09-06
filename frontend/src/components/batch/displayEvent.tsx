import { BatchEvent } from "@/TracerAPI";
import { useState } from "react";
import DocumentContainer from "./documentContainer";

interface Props {
  event: BatchEvent;
}
export default function DisplayEvent(props: Props) {
  const [showDocument, setShowDocument] = useState(false);

  const toggleInfo = () => {
    setShowDocument(!showDocument);
  };

  return (
    <div className="ml-3 flex-grow">
      <p className="text-sm font-medium text-green-500">Owner</p>
      <p className="text-sm text-gray-900">TODO</p>
      <p className="text-xs text-gray-500">Ts: TODO</p>
      {props.event.documentURI && (
        <>
          <button
            className="text-xs text-gray-500 underline"
            onClick={() => toggleInfo()}
          >
            Show Document
          </button>
          {showDocument && (
            <div className="text-xs text-gray-500">
              <DocumentContainer uri={props.event.documentURI} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
