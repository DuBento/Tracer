"use client";

import { BatchLog } from "@/TracerAPI";
import Log from "../clientView/log";

interface Props {
  batch: BatchLog;
}

const DisplayBatch = (props: Props) => {
  return (
    <>
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="mb-2 font-mono text-lg font-bold text-gray-900">ID</h2>
          <p className="mb-2 text-gray-500">{props.batch.batchId.toString()}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
              <div className="px-4 py-5 sm:w-1/2">
                <dt className="text-sm font-semibold text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {props.batch.batchDescription}
                </dd>
              </div>
              <div className="px-4 py-5 sm:w-1/2">
                <dt className="text-sm font-semibold text-gray-500">
                  Current Owner
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <h2 className="text-sm ">
                    {props.batch.currentOwnerName}
                    <p className="text-xs font-thin">
                      {props.batch.currentOwnerAddress}
                    </p>
                  </h2>
                </dd>
              </div>
            </div>
            <div className="px-4 py-5">
              <dt className="text-sm font-semibold text-gray-500">
                Current State
              </dt>
              <dd
                className={`mt-1 text-sm text-gray-900 ${
                  props.batch.warning && "font-bold text-redwood"
                }`}
              >
                {props.batch.state.toString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-4 sm:px-6">
          <h2 className="font-mono text-lg font-bold text-gray-900">Logs</h2>
        </div>
        <div className="flex-grow whitespace-normal break-words border-t border-gray-200 text-black ">
          <Log batchLog={props.batch} bgFill="fill-white" showAddress />
        </div>
      </div>
    </>
  );
};

export default DisplayBatch;
