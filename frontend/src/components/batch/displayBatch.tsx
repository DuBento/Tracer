"use client";

import { BatchContext } from "@/context/batchContext";
import BlockchainServices, {
  Transaction,
  Update,
} from "@/services/BlockchainServices";
import { useContext, useState } from "react";
import DocumentContainer from "./documentContainer";

const DisplayBatch = ({}) => {
  const { batch, setBatch } = useContext(BatchContext);

  return (
    <>
      {batch && (
        <>
          <div className="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">ID</h2>
              <p className="mb-2 text-gray-500">{batch.id.toString()}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
                  <div className="px-4 py-5 sm:w-1/2">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {batch.description}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:w-1/2">
                    <dt className="text-sm font-medium text-gray-500">
                      Current Owner
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {batch.currentOwner}
                    </dd>
                  </div>
                </div>
                <div className="px-4 py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Current State
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {batch.state.toString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">Updates</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {batch.updates.map((update, idx) => (
                  <li className="px-4 py-4 sm:px-6" key={idx}>
                    <DisplayUpdate update={update} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">
                Transactions
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {batch.transactions.map((transaction, idx) => (
                  <li className="px-4 py-4 sm:px-6" key={idx}>
                    <DisplayTransaction transaction={transaction} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

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

interface DisplayTransactionProps {
  transaction: Transaction;
}
const DisplayTransaction = ({ transaction }: DisplayTransactionProps) => {
  const [showDocument, setShowDocument] = useState(false);

  const toggleInfo = () => {
    setShowDocument(!showDocument);
  };

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
        <p className="text-sm font-medium text-blue-500">Receiver</p>
        <p className="text-sm text-gray-900">
          {transaction.receiver.toString()}
        </p>
        <p className="text-xs text-gray-500">
          Owner: {transaction.info.owner.toString()}
        </p>
        <p className="text-xs text-gray-500">
          Ts: {BlockchainServices.parseTime(transaction.info.ts)}
        </p>
        {transaction.info.documentURI && (
          <>
            <button
              className="text-xs text-gray-500 underline"
              onClick={() => toggleInfo()}
            >
              Show Document
            </button>
            {showDocument && (
              <div className="text-xs text-gray-500">
                <DocumentContainer uri={transaction.info.documentURI} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayBatch;
