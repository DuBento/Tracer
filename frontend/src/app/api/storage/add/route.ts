import TracerAPI from "@/TracerAPI";
import { connectEthereum } from "@/TracerAPI/connection";
import CryptoService, {
  FORMDATA_SIGNATURE_KEY,
  FORMDATA_TIMESTAMP_KEY,
} from "@/services/CryptoService";
import {
  FORMDATA_BATCH_ID_KEY,
  FORMDATA_CONTRACT_ADDRESS_KEY,
  FORMDATA_DESCRIPTION_KEY,
  FORMDATA_FILES_KEY,
  INDEX_FILE,
  composeMetadata,
} from "@/services/StorageService";
import { NextResponse } from "next/server";

const ALLOWED_BLOCK_WINDOW = 50; // blocks

/**
 *  TODO Improve by having a dedicated server always running and listening to events, storing the latest to cache the timestamp for security check
 */

export async function POST(request: Request) {
  try {
    // parse request
    const requestFormData = await request.formData();
    const description = requestFormData.get("description");
    const files = requestFormData.getAll("file");

    // asserts
    await checkValidRequest(requestFormData);
    checkAvailableIndexFilename(files);
    await checkExistingBatch(requestFormData);
    await checkUserAccess(requestFormData);

    // fit with metadata
    const metadata = composeMetadata(description as string, files as File[]);
    // create body
    const formData = new FormData();
    for (const file of files) {
      if (file instanceof File)
        formData.append(
          "file",
          new Blob([await file.arrayBuffer()], { type: file.type }),
          `${file.name}`,
        );
    }
    formData.append(
      "file",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      `${INDEX_FILE}`,
    );

    // request
    const requestUrl = `${process.env
      .STORAGE_API_ADD!}?wrap-with-directory=true`;

    const res = await fetch(requestUrl, {
      method: "POST",
      body: formData,
      headers: authHeader(),
    }).catch((e) => {
      throw new Error("Error interacting with storage server");
    });

    if (!res.ok)
      throw new Error(
        `Received error from storage server: ${res.status} ${res.statusText}`,
      );

    const data = await res.text();
    for (const jsonString of data.split("\n")) {
      if (!jsonString) continue;
      const json = JSON.parse(jsonString);
      // CID for directory
      if (json.Name == "") {
        return new NextResponse(JSON.stringify(json.Hash), { status: 200 });
      }
    }
  } catch (e: any) {
    console.error(e);
    return new NextResponse(e.message, { status: 400 });
  }
}

function authHeader() {
  const authHeader = new Headers();
  if (process.env.STORAGE_API_KEY && process.env.STORAGE_API_KEY_SECRET)
    authHeader.append(
      "Authorization",
      "Basic " +
        Buffer.from(
          process.env.STORAGE_API_KEY +
            ":" +
            process.env.STORAGE_API_KEY_SECRET,
        ).toString("base64"),
    );
  return authHeader;
}

function checkAvailableIndexFilename(files: FormDataEntryValue[]) {
  if (files.find((file) => (file as File).name == INDEX_FILE))
    throw new Error(`File name cannot be the same as ${INDEX_FILE}`);
}

async function checkValidRequest(formData: FormData) {
  const description = formData.get(FORMDATA_DESCRIPTION_KEY);
  const contractAddress = formData.get(FORMDATA_CONTRACT_ADDRESS_KEY);
  const batchId = formData.get(FORMDATA_BATCH_ID_KEY);
  const signature = formData.get(FORMDATA_SIGNATURE_KEY);
  const timestamp = formData.get(FORMDATA_TIMESTAMP_KEY);
  const files = formData.getAll(FORMDATA_FILES_KEY);

  if (!description || !(typeof description == "string"))
    throw new Error(`Missing form data fields: ${FORMDATA_DESCRIPTION_KEY}`);
  if (!contractAddress || !(typeof contractAddress == "string"))
    throw new Error(
      `Missing form data fields: ${FORMDATA_CONTRACT_ADDRESS_KEY}`,
    );
  if (!batchId || !(typeof batchId == "string"))
    throw new Error(`Missing form data fields: ${FORMDATA_BATCH_ID_KEY}`);
  if (!signature || !(typeof signature == "string"))
    throw new Error(`Missing form data fields: ${FORMDATA_SIGNATURE_KEY}`);
  if (!timestamp || !(typeof timestamp == "string"))
    throw new Error(`Missing form data fields: ${FORMDATA_TIMESTAMP_KEY}`);
  if (files && !files.every((file) => file instanceof File))
    throw new Error("Wrong form data format: files");
}

async function checkExistingBatch(formData: FormData) {
  const contractAddress = formData.get(FORMDATA_CONTRACT_ADDRESS_KEY) as string;
  const batchId = formData.get(FORMDATA_BATCH_ID_KEY) as string;

  const batch = await TracerAPI.Traceability.getBatch(contractAddress, batchId);
  if (!batch.id) throw new Error("Batch does not exist");
}

async function checkUserAccess(formData: FormData) {
  const signature = formData.get(FORMDATA_SIGNATURE_KEY) as string;
  const address = CryptoService.verifySignature(formData, signature);

  const contractAddress = formData.get(FORMDATA_CONTRACT_ADDRESS_KEY) as string;

  // Check if actor is registred and linked to the contract
  const hasPermission = await TracerAPI.UserRegistry.checkAccess(
    contractAddress,
    address,
  );
  if (!hasPermission) throw new Error("User does not have permission");

  // Check additional security components
  const timestamp = BigInt(formData.get(FORMDATA_TIMESTAMP_KEY) as string);
  const batchId = formData.get(FORMDATA_BATCH_ID_KEY) as string;

  const provider = await connectEthereum();
  const currentBlockNumber = await provider.getBlockNumber();
  const lastAllowedBlockNumber =
    currentBlockNumber > ALLOWED_BLOCK_WINDOW
      ? currentBlockNumber - ALLOWED_BLOCK_WINDOW
      : 0;

  const updates = await TracerAPI.Traceability.getUpdates(
    contractAddress,
    batchId,
    address,
    lastAllowedBlockNumber,
  );

  let lastAllowedTimestamp;
  if (updates) {
    const lastUpdate = updates[updates.length - 1];
    lastAllowedTimestamp = lastUpdate.ts;
  } else {
    // query last allowed timestamp
    const latestAllowedBlock = await provider.getBlock(lastAllowedBlockNumber);
    if (!latestAllowedBlock)
      throw new Error("Could not get latest allowed block");
    lastAllowedTimestamp = latestAllowedBlock?.timestamp;
  }

  if (lastAllowedTimestamp > timestamp)
    throw new Error(
      `Timestamp is not valid. Wait ${
        Number(lastAllowedTimestamp) - Number(timestamp)
      } seconds`,
    );

  return true;
}
