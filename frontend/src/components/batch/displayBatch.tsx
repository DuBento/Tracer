"use client";

import { Batch } from "@/services/BlockchainServices";
import DisplayTransaction from "./displayTransaction";
import DisplayUpdate from "./displayUpdate";

interface Props {
  batch: Batch;
}

const DisplayBatch = (props: Props) => {
  return (
    <>
      {props.batch && (
        <>
          <div className="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">ID</h2>
              <p className="mb-2 text-gray-500">{props.batch.id.toString()}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
                  <div className="px-4 py-5 sm:w-1/2">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {props.batch.description}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:w-1/2">
                    <dt className="text-sm font-medium text-gray-500">
                      Current Owner
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {props.batch.currentOwner}
                    </dd>
                  </div>
                </div>
                <div className="px-4 py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Current State
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {props.batch.state.toString()}
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
                {props.batch.updates.map((update, idx) => (
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
                {props.batch.transactions.map((transaction, idx) => (
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

export default DisplayBatch;
