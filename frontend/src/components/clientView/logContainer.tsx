"use client";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function LogContainer(props: Props) {
  function resizeHeader(event: any) {
    const description = document.getElementById("cv-header-description");
    if (!description) return;
    description.style.display = "none";
    // console.log();
    // console.log({ event });
  }

  return (
    <div
      className="relative max-h-screen overflow-y-scroll"
      onScroll={(e) => resizeHeader(e)}
    >
      {props.children}
    </div>
  );
}
