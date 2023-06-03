"use client";

import { BatchContext } from "@/context/batchContext";
import BlockchainServices, {
  Transaction,
  Update,
} from "@/services/BlockchainServices";
import { useContext } from "react";

const DisplayBatch = ({}) => {
  const { batch, setBatch } = useContext(BatchContext);

  function stringifyEthersResult(obj: any, level = 0): string[] {
    let res: string[] = [];
    const whitespace = "\t".repeat(level);
    for (const key of Object.keys(obj)) {
      if (!Number.isInteger(Number(key))) {
        if (Array.isArray(obj[key])) {
          let nestedResult;
          if (
            Object.keys(obj[key]).every((key) => Number.isInteger(Number(key)))
          )
            nestedResult = obj[key].flatMap((v: any) =>
              stringifyEthersResult(v, level + 2).concat(
                `${"\t".repeat(level + 2)}---`
              )
            );
          else nestedResult = stringifyEthersResult(obj[key], level + 2);
          res.push(`${whitespace}${key}:`, ...nestedResult);
        } else res.push(`${whitespace}${key}: ${obj[key]}`);
      }
    }
    return res;
  }

  function toggleDisplayDocument(id: string) {
    var documentContainer = document.getElementById(id);
    documentContainer?.classList.toggle("hidden");
  }

  function displayUpdate(update: Update, idx: number) {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M13.707 8.707a1 1 0 0 0-1.414-1.414L8 10.586 6.707 9.293a1 1 0 1 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l5-5z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-500">Owner</p>
          <p className="text-sm text-gray-900">{update.owner.toString()}</p>
          <p className="text-xs text-gray-500">
            Ts: {BlockchainServices.parseTime(update.ts)}
          </p>
          {update.documentURI && (
            <>
              <button
                className="text-xs text-gray-500 underline"
                onClick={() => toggleDisplayDocument(`document-update-${idx}`)}
              >
                Show Document
              </button>
              <div id={`document-update-${idx}`} className="hidden">
                <p className="text-xs text-gray-500">
                  Document: {update.documentURI.toString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function displayTransaction(transaction: Transaction, idx: number) {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M13.707 8.707a1 1 0 0 0-1.414-1.414L8 10.586 6.707 9.293a1 1 0 1 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l5-5z"
              clip-rule="evenodd"
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
                onClick={() =>
                  toggleDisplayDocument(`document-transaction-${idx}`)
                }
              >
                Show Document
              </button>
              <div id={`document-transaction-${idx}`} className="hidden">
                <p className="text-xs text-gray-500">
                  Document: {transaction.info.documentURI.toString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {batch && (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-gray-900 text-lg font-bold mb-2">ID</h2>
              <p className="text-gray-500 mb-2">{batch.id.toString()}</p>
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
                  <dd className="mt-1 text-sm text-gray-900">{batch.state}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-gray-900 text-lg font-bold mb-2">Updates</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {batch.updates.map(displayUpdate).map((e, k) => (
                  <li className="px-4 py-4 sm:px-6" key={k}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-gray-900 text-lg font-bold mb-2">
                Transactions
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {batch.transactions.map(displayTransaction).map((e, k) => (
                  <li className="px-4 py-4 sm:px-6" key={k}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 
          {stringifyEthersResult(batch).map((val, idx) => (
            <p
              className="text-base font-semibold font-sans whitespace-pre"
              key={idx}
            >
              {val}
            </p>
          ))} */}
        </>
      )}
    </>
  );
};

export default DisplayBatch;
