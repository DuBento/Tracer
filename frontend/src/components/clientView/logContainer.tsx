"use client";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function LogContainer(props: Props) {
  let transitioning = false;
  function resizeHeader(event: any) {
    if (transitioning) return;

    const container = document.getElementById("cv-log-container");
    console.log(container?.scrollTop);
    var description = document.getElementById("cv-header-description");

    var wrapper = document.getElementById("cv-measuringWrapper");
    window.requestAnimationFrame(() => {
      if (container?.scrollTop! > 50 && description?.style.maxHeight != "0px") {
        transitioning = true;
        description!.style.maxHeight = "0px";
      } else if (
        container?.scrollTop! < 10 &&
        description?.style.maxHeight == "0px"
      ) {
        transitioning = true;
        description!.style.maxHeight = wrapper?.clientHeight + "px";
      }
    });
  }

  return (
    <div
      id="cv-log-container"
      className="relative max-h-screen overflow-y-scroll"
      onScroll={(e) => resizeHeader(e)}
      onTransitionEnd={() => (transitioning = false)}
    >
      {props.children}
    </div>
  );
}
