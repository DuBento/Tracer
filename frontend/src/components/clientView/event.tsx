"use client";

import { BatchEvent } from "@/TracerAPI";
import NotificationContext from "@/context/notificationContext";
import ChevronIcon from "@/public/images/chevronIcon";
import StorageService from "@/services/StorageService";
import Image from "next/image";
import { useContext, useState } from "react";
import useSWR from "swr";
import Skeleton from "../common/skeleton";

type Props = {
  event: BatchEvent;
};

export default function Event(props: Props) {
  const uri = props.event.documentURI;
  const [expanded, setExpanded] = useState(false);
  const [currentSrcIdx, setCurrentSrcIdx] = useState(0);
  const notifications = useContext(NotificationContext);

  const { data, error, isLoading } = useSWR(
    uri,
    StorageService.fetchIndexDocument,
  );

  if (error) {
    notifications.error("Failed to load event");
    return <div>Failed to load</div>;
  }
  if (isLoading)
    return (
      <div className="flex-start flex items-start justify-between gap-5 align-top">
        <div className="-ml-[5px] mt-1 flex-none leading-tight">
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="-mt-1 flex-grow ">
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex-none text-xs font-thin leading-tight">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  if (!data) return null;

  const sources = [
    ...data.imgs.map((filename) => ({ filename, type: "imgs" })),
    ...data.vids.map((filename) => ({ filename, type: "vids" })),
    ...data.txt.map((filename) => ({ filename, type: "txt" })),
    ...data.pdf.map((filename) => ({ filename, type: "pdf" })),
    ...data.other.map((filename) => ({ filename, type: "other" })),
  ];
  const sourcesCount = sources.length;

  function expandImage(srcIdx: number) {
    setCurrentSrcIdx(srcIdx);
    setExpanded(true);
  }

  function positiveScroll() {
    setCurrentSrcIdx((currentSrcIdx + 1) % sourcesCount);
  }

  function negativeScroll() {
    setCurrentSrcIdx((currentSrcIdx - 1 + sourcesCount) % sourcesCount);
  }

  function exitFullscreen() {
    setExpanded(false);
  }

  const matchDataToHTML = (
    filename: string,
    type: string,
    idx: number,
    preview: boolean,
  ) => {
    if (type === "imgs") {
      return (
        <Image
          src={StorageService.generateResourceURL(uri, filename).toString()}
          width="144"
          height="144"
          sizes={preview ? "50vw" : "100vw"}
          className="h-full w-auto"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcUA8AAeUBMdl0U3EAAAAASUVORK5CYII"
          alt={filename}
          priority={idx <= 1}
        />
      );
    } else if (type === "vids") {
      if (preview) {
        return (
          <>
            <video className="h-full w-auto" preload="metadata">
              <source
                src={`${StorageService.generateResourceURL(
                  uri,
                  filename,
                ).toString()}#t=0.1`}
              />
            </video>
            <div className="absolute left-1/2 top-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform">
              <svg
                className="fill-redwood"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M381-239q-20 13-40.5 1.5T320-273v-414q0-24 20.5-35.5T381-721l326 207q18 12 18 34t-18 34L381-239Z" />
              </svg>
            </div>
          </>
        );
      } else {
        return (
          <video className="h-full w-auto" loop autoPlay>
            <source
              src={StorageService.generateResourceURL(uri, filename).toString()}
            />
          </video>
        );
      }
    } else
      return (
        <div className="aspect-square h-full break-all bg-platinum p-2">
          <a
            href={StorageService.generateResourceURL(uri, filename).toString()}
            onClick={(e) => e.stopPropagation()}
            download
            className="m-auto flex h-full items-center justify-center"
          >
            <div className="overflow-hidden text-center font-mono text-xs font-bold text-redwood-600">
              <svg
                className="m-auto h-16 w-16"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              </svg>
              <p>{filename}</p>
            </div>
          </a>
        </div>
      );
  };

  return (
    <>
      <div className="flex-start flex items-start justify-between gap-5 align-top">
        <div className="z-10 -ml-[5px] mt-1 flex-none">
          <LogBulletPointSmall className="bg-sage" h-32 w-full />
        </div>
        <h4 className="-mt-1 flex-grow font-body text-base leading-tight ">
          {data?.desc}
        </h4>
        <div className="flex-none text-xs font-thin leading-tight">
          {props.event.date} · {props.event.time}
        </div>
      </div>

      {/* Preview scroll */}
      {sourcesCount > 0 && (
        <div className="ml-6 mt-3">
          <div className="relative flex h-36 snap-x snap-mandatory gap-2 overflow-x-auto pb-4">
            {sources.map(({ filename, type }, idx) => (
              <div
                key={`${idx}`}
                className="relative h-full shrink-0 snap-center overflow-hidden rounded-lg shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  expandImage(idx);
                }}
              >
                {matchDataToHTML(filename, type, idx, true)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            exitFullscreen();
          }}
        >
          <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-auto bg-black/20 p-4">
            <div className="relative max-h-[90vh] w-fit md:max-w-[90vh]">
              <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md">
                {matchDataToHTML(
                  sources[currentSrcIdx].filename,
                  sources[currentSrcIdx].type,
                  currentSrcIdx,
                  false,
                )}
              </div>
              <div
                className="absolute left-0 top-0 flex h-full w-1/2 cursor-pointer items-center justify-start pl-2"
                onClick={(e) => {
                  e.stopPropagation();
                  negativeScroll();
                }}
              >
                <ChevronIcon className="h-10 w-10 rotate-90 transform fill-pearl" />
              </div>
              <div
                className="absolute right-0 top-0 z-50 flex h-full w-1/2 cursor-pointer items-center justify-end pr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  positiveScroll();
                }}
              >
                <ChevronIcon className="h-10 w-10 -rotate-90 transform fill-pearl" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const LogBulletPointSmall = (props: { className: string }) => (
  <div className={`${props.className} h-2 w-2 rounded-full`}></div>
);
