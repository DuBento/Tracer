"use client";

import {
  CLIENT_VIEW_PAGE_LOCATION,
  GS1_DATA_LINK_BATCH_PREFIX,
  GS1_DATA_LINK_GTIN_PREFIX,
  QR_CODE_PROTOCOL,
} from "@/properties";
import { Batch } from "@/services/BlockchainServices";
import base64url from "base64url";
import { useState } from "react";
import LogoQrCode from "../common/logoQrCode";

interface Props {
  batch: Batch;
}

const QRCode = (props: Props) => {
  const [gtin, setGtin] = useState<string>("");
  const [qrCodeElement, setQrCodeElement] = useState<JSX.Element>();

  const generateQrcode = async () => {
    if (!props.batch.id) return;

    const bytes = props.batch.id.toString(16);
    const buffer = Buffer.from(bytes, "hex");

    const b64id = base64url.encode(buffer);
    console.log({ b64id });

    let path = `${CLIENT_VIEW_PAGE_LOCATION}/${GS1_DATA_LINK_BATCH_PREFIX}/${b64id}`;
    if (gtin) path = path.concat(`/${GS1_DATA_LINK_GTIN_PREFIX}/${gtin}`);
    const url = new URL(
      path,
      `${QR_CODE_PROTOCOL}://${window.location.host}`,
    ).toString();

    setQrCodeElement(
      <div
        id="qrcode-created-container"
        className="aspect-square h-full overflow-hidden rounded-md"
      >
        <LogoQrCode url={url} imageSize={24} />
      </div>,
    );
  };

  const downloadQrcode = () => {
    const newQrcode = document.getElementById("qrcode-created-container");
    const blob = new Blob([newQrcode!.innerHTML], { type: "image/svg+xml" });

    const element = document.createElement("a");
    element.download = "qrcode.svg";
    element.href = window.URL.createObjectURL(blob);
    element.click();
    element.remove();
  };

  if (qrCodeElement)
    return (
      <div className="flex h-full w-full flex-row items-center py-4">
        {qrCodeElement}
        <div className="ml-4 flex flex-col justify-center">
          <button
            className="my-2 h-12 w-12 rounded-full bg-red-300 p-2 font-semibold hover:bg-red-400"
            onClick={() => setQrCodeElement(undefined)}
          >
            {/* close icon */}
            <svg
              className="h-full w-full"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M480-416 281-218q-13 13-32 13.5T218-218q-14-13-14-31.5t14-32.5l199-198-199-199q-14-13-14-31.5t14-32.5q12-13 31-12.5t32 13.5l199 198 199-198q13-13 32-13.5t31 12.5q14 14 14 32.5T743-679L544-480l199 198q13 14 13 32.5T742-218q-12 14-31 13.5T679-218L480-416Z" />
            </svg>
          </button>
          <button
            className="my-2 h-12 w-12 rounded-full bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
            onClick={downloadQrcode}
          >
            {/* download icon */}
            <svg
              className="h-full w-full"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M480.256-342q-8.399 0-17.849-3.773Q452.957-349.545 447-356L288-516q-14-12.364-13.708-31.208.291-18.844 14.317-32.363Q301.4-593.154 321-592.577 340.6-592 354-579l81 81v-278q0-19.65 12.86-32.825Q460.719-822 480.36-822 500-822 513-808.825T526-776v278l82-81q12.667-13 30.748-13.657 18.082-.657 32.411 12.577Q684-567 684-547.682q0 19.318-13 33.682L513-356q-5.81 6.455-15.221 10.227Q488.368-342 480.256-342ZM230-139q-37.175 0-64.087-26.913Q139-192.825 139-230v-98q0-18.375 12.86-31.688Q164.719-373 184.36-373 204-373 217-359.688q13 13.313 13 31.688v98h500v-98q0-18.375 13.56-31.688Q757.119-373 775.772-373q20.053 0 33.14 13.312Q822-346.375 822-328v98q0 37.175-27.206 64.087Q767.588-139 730-139H230Z" />
            </svg>
          </button>
        </div>
      </div>
    );

  return (
    <>
      <h2 className="font-mono text-2xl ">QRCode</h2>
      <p className="text-base leading-6">GTIN</p>
      <div className="mt-2">
        <input
          id="GTIN"
          name="GTIN"
          type="text"
          inputMode="numeric"
          autoComplete="GTIN"
          placeholder="Optional"
          value={gtin}
          className="block w-full rounded-md border-0 bg-coolgray-500 
              py-1.5 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
          onChange={(e) =>
            setGtin(e.target.value.replace(/\D/g, "").substring(0, 14))
          }
        />
      </div>

      <button
        className="my-4 rounded bg-red-300 px-2 py-1.5 font-bold hover:bg-red-200 hover:font-extrabold hover:text-white"
        type="submit"
        onClick={generateQrcode}
      >
        Generate
      </button>
    </>
  );
};

export default QRCode;
