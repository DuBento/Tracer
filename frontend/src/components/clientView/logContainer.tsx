"use client";
import React from "react";

type Props = {
  className: string;
  children?: React.ReactNode;
};

export default function LogContainer(props: Props) {
  let transitioning = false;
  function resizeHeader(event: any) {
    if (transitioning) return;

    const container = document.getElementById("cv-log-container");
    var description = document.getElementById("cv-header-description");
    console.log(container?.scrollTop);

    window.requestAnimationFrame(() => {
      if (container?.scrollTop! > 50 && description?.style.maxHeight != "0px") {
        transitioning = true;
        description!.style.maxHeight = "0px";
      } else if (
        container?.scrollTop! < 5 &&
        description?.style.maxHeight == "0px"
      ) {
        transitioning = true;
        description!.style.maxHeight = description.scrollHeight + "px";
      }
    });
  }

  return (
    <div
      id="cv-log-container"
      className={`relative h-screen max-h-screen overflow-y-scroll bg-isabelline ${props.className}`}
      onScroll={(e) => resizeHeader(e)}
      onTransitionEnd={() => (transitioning = false)}
    >
      {props.children}
    </div>
  );
}
