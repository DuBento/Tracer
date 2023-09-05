"use client";

import { BatchEvent, BatchLog } from "@/TracerAPI";
import ChevronIcon from "@/public/images/chevronIcon";
import { SVGProps, useState } from "react";
import Event from "./event";

type Props = {
  batchLog: BatchLog;
};

export default function Log(props: Props) {
  const [expanded, setExpanded] = useState<boolean[]>(
    props.batchLog.log.map(() => true),
  );

  function toggleExpansion(idx: number) {
    const updatedExpandedItems = [...expanded];
    updatedExpandedItems[idx] = !updatedExpandedItems[idx];
    setExpanded(updatedExpandedItems);
  }

  return (
    <div className="h-screen w-screen overflow-auto bg-isabelline pb-10 pl-10 pr-8 pt-8 font-body">
      <ol className="border-l-[2px] border-brunswick_green">
        {props.batchLog.log.map((log, idx) => (
          <li key={idx} className="pb-2">
            <div className="flex items-start justify-between gap-4 align-top">
              <div className="z-10 -ml-[14px] flex-none">
                <LogBulletPoint className="fill-brunswick_green" />
              </div>
              <h4 className="-mt-2 flex-grow text-xl leading-tight">
                {log.actorName}
              </h4>
              <div
                className="mt-1 h-4 flex-none"
                onClick={() => toggleExpansion(idx)}
              >
                {!expanded[idx] && (
                  <ChevronIcon className="fill-brunswick_green-400" />
                )}
                {expanded[idx] && (
                  <ChevronIcon className="rotate-180 transform fill-brunswick_green-400" />
                )}
              </div>
            </div>

            {!expanded[idx] && log.receivingDate && (
              <div className="mb-6 ml-6 text-xs font-light">
                {log.receivingDate}
              </div>
            )}

            {expanded[idx] && (
              <>
                {log.receivingDate && log.receivingTime && (
                  <div className="mb-6 ml-6 text-xs font-light">
                    {log.receivingDate} · {log.receivingTime}
                  </div>
                )}

                <ol className="mb-2">
                  {log.events.map((event: BatchEvent, idx) => (
                    <li key={idx} className="mt-4">
                      <Event event={event} />
                    </li>
                  ))}
                </ol>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

const LogBulletPoint = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className={props.className}
    width={20}
    height={23}
    viewBox="0 0 20 23"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <rect x={2} y={1} width={17} height={22} fill="#EEECE8" />
    <circle cx={13} cy={7} r={7} />
    <path d="M2 7C2 6.44772 1.55228 6 1 6C0.447715 6 0 6.44772 0 7H2ZM9.16812 17.8525L9.45499 16.8946L9.16812 17.8525ZM9.66144 18.0062L9.32915 18.9494L9.66144 18.0062ZM12.9943 22.4833L13.9932 22.4356L12.9943 22.4833ZM7.3941 17.2896L7.75469 16.3569L7.3941 17.2896ZM8.71314 18.7602L8.88126 18.8105L9.45499 16.8946L9.28687 16.8442L8.71314 18.7602ZM8.88126 18.8105C9.14515 18.8895 9.24449 18.9196 9.32915 18.9494L9.99373 17.063C9.85304 17.0135 9.69862 16.9675 9.45499 16.8946L8.88126 18.8105ZM14 23C14 22.7457 14.0003 22.5846 13.9932 22.4356L11.9954 22.5311C11.9997 22.6207 12 22.7245 12 23H14ZM9.32915 18.9494C10.8636 19.49 11.9177 20.9061 11.9954 22.5311L13.9932 22.4356C13.8766 19.998 12.2954 17.8739 9.99373 17.063L9.32915 18.9494ZM0 7C0 7.88321 -0.000756277 8.38161 0.0333999 8.81892L2.02733 8.66319C2.00076 8.32299 2 7.91986 2 7H0ZM9.28687 16.8442C8.44219 16.5913 8.07318 16.48 7.75469 16.3569L7.03351 18.2223C7.44243 18.3804 7.90155 18.5171 8.71314 18.7602L9.28687 16.8442ZM0.0333999 8.81892C0.363028 13.0392 3.08516 16.6959 7.03351 18.2223L7.75469 16.3569C4.52422 15.108 2.29702 12.1162 2.02733 8.66319L0.0333999 8.81892Z" />
  </svg>
);
