"use client";

import ChevronIcon from "@/public/images/chevronIcon";
import Image from "next/image";
import { useState } from "react";

type Props = {
  description: string;
  date: string;
  hour: string;
  files: string[];
};

export default function Event(props: Props) {
  const imgSrc = [
    "/images/mock/beach.jpg",
    "/images/mock/crop.jpeg",
    "/images/mock/food.jpeg",
    "/images/mock/paintingWallpaper.png",
    "/images/mock/storage.jpeg",
    "/images/mock/walmart.webp",
    "/images/mock/waterfall.mp4",
  ];
  const sourcesCount = imgSrc.length;

  const [expanded, setExpanded] = useState(false);
  const [currentSrcIdx, setCurrentSrcIdx] = useState(0);

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

  return (
    <>
      <div className="flex-start flex items-start justify-between gap-5 align-top">
        <div className="z-10 -ml-[5px] flex-none">
          <LogBulletPointSmall className="bg-sage" h-32 w-full />
        </div>
        <h4 className="-mt-1 flex-grow text-sm leading-tight ">
          {props.description} with regard to the following files:
        </h4>
        <div className="flex-none text-xs font-thin leading-tight">
          {props.date} · {props.hour}
        </div>
      </div>

      {/* Preview scroll */}
      <div className="ml-6 mt-3">
        <div className="relative flex h-36 snap-x snap-mandatory gap-2 overflow-x-auto pb-4">
          {imgSrc.map((src, idx) => (
            <div
              key={idx}
              className="h-full shrink-0 snap-center"
              onClick={() => expandImage(idx)}
            >
              <Image
                src={src}
                width="0"
                height="0"
                sizes="50vw"
                className="h-full w-auto rounded-lg shadow-md"
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvLGrHgAGPAJfdxHGYQAAAABJRU5ErkJggg=="
                alt="update image TODO filename"
              />
            </div>
          ))}
        </div>

        {/* Expanded view */}
        {expanded && (
          <div id="CVDocumentFullscreen" onClick={exitFullscreen}>
            <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-auto bg-black/20 p-4">
              <div className="relative max-h-[90vh] w-full md:max-w-[90vh]">
                <div
                  className="absolute left-0 top-0 flex h-full w-1/2 cursor-pointer items-center justify-start pl-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    negativeScroll();
                  }}
                >
                  <ChevronIcon className="h-10 w-10 rotate-90 transform fill-pearl" />
                </div>
                <Image
                  id="CVDocumentFullscreen-img"
                  src={imgSrc[currentSrcIdx]}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="h-full w-full rounded-lg shadow-md"
                  placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvLGrHgAGPAJfdxHGYQAAAABJRU5ErkJggg=="
                  alt="update image extended TODO filename"
                />
                <div
                  className="absolute right-0 top-0 flex h-full w-1/2 cursor-pointer items-center justify-end pr-2"
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
      </div>
    </>
  );
}

const LogBulletPointSmall = (props: { className: string }) => (
  <div className={`${props.className} h-2 w-2 rounded-full`}></div>
);
