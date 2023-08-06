"use client";

import { BatchContext } from "@/context/batchContext";
import {
  CLIENT_VIEW_PAGE_LOCATION,
  GS1_DATA_LINK_BATCH_PREFIX,
  GS1_DATA_LINK_GTIN_PREFIX,
  QR_CODE_PROTOCOL,
} from "@/properties";
import base64url from "base64url";
import { QRCodeSVG } from "qrcode.react";
import { useContext, useState } from "react";

const QRCode = ({}) => {
  const { batch } = useContext(BatchContext);

  const [gtin, setGtin] = useState<string>("");
  const [qrcode, setQrcode] = useState<JSX.Element>();

  const generateQrcode = () => {
    console.log({ batch, gtin });
    if (!batch?.id) return;

    const bytes = batch?.id.toString(16);
    const buffer = Buffer.from(bytes, "hex");

    const b64id = base64url.encode(buffer);
    console.log({ b64id });

    let path = `${CLIENT_VIEW_PAGE_LOCATION}/${GS1_DATA_LINK_BATCH_PREFIX}/${b64id}`;
    if (gtin) path = path.concat(`/${GS1_DATA_LINK_GTIN_PREFIX}/${gtin}`);
    const url = new URL(
      path,
      `${QR_CODE_PROTOCOL}://${window.location.host}`
    ).toString();

    console.log({ url }, batch?.id);

    setQrcode(
      <QRCodeSVG
        value={url}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"M"}
        includeMargin={true}
        imageSettings={{
          src: "/images/logo.svg",
          height: 24,
          width: 24,
          excavate: true,
        }}
        className="rounded-md"
      />
    );
  };

  if (!batch) return null;

  if (qrcode)
    return (
      <div className="flex flex-row items-center h-full">
        {qrcode}
        <div className="flex flex-col justify-center ml-4">
          <button
            className="my-2 px-4 py-2 rounded-md bg-red-300 hover:bg-red-400 text-white font-semibold"
            onClick={() => setQrcode(undefined)}
          >
            Back
          </button>
          <button
            className="my-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            onClick={() => {
              // TODO Add download logic here
            }}
          >
            Download
          </button>
        </div>
      </div>
    );

  return (
    <>
      <h2 className="text-2xl font-mono ">QRCode</h2>
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
          className="block w-full rounded-md border-0 py-1.5 
              bg-coolgray-500 text-coolgray-200 shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
          onChange={(e) =>
            setGtin(e.target.value.replace(/\D/g, "").substring(0, 14))
          }
        />
      </div>

      <button
        className="my-4 px-2 py-1.5 rounded bg-red-300 font-bold hover:bg-red-200 hover:text-white hover:font-extrabold"
        type="submit"
        onClick={generateQrcode}
      >
        Generate
      </button>
    </>
  );
};

export default QRCode;
