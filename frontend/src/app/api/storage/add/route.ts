import { INDEX_FILE, composeMetadata } from "@/services/StorageService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // parse request
    const requestFormData = await request.formData();
    const description = requestFormData.get("description");
    const files = requestFormData.getAll("file");

    // asserts
    checkAddFileRequestData(description, files);
    checkAvailableIndexFilename(files);
    // TODO check permisson from user

    // fit with metadata
    const metadata = composeMetadata(description as string, files as File[]);
    // create body
    const formData = new FormData();
    for (const file of files) {
      if (file instanceof File) formData.append("file", file, `${file.name}`);
    }
    formData.append(
      "file",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      `${INDEX_FILE}`,
    );

    // request
    const queryParams = new URLSearchParams();
    queryParams.append("wrap-with-directory", "true");

    const myHeaders = new Headers();
    if (process.env.STORAGE_API_KEY && process.env.STORAGE_API_KEY_SECRET)
      myHeaders.append(
        "Authorization",
        "Basic " +
          Buffer.from(
            process.env.STORAGE_API_KEY +
              ":" +
              process.env.STORAGE_API_KEY_SECRET,
          ).toString("base64"),
      );

    const requestUrl = `${process.env
      .STORAGE_API_ADD!}?${queryParams.toString()}`;
    const res = await fetch(requestUrl, {
      method: "POST",
      body: formData,
      headers: myHeaders,
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
    // return new NextResponse(JSON.stringify(description), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new NextResponse(e.message, { status: 400 });
  }
}

function checkAvailableIndexFilename(files: FormDataEntryValue[]) {
  if (files.find((file) => (file as File).name == INDEX_FILE))
    throw new Error(`File name cannot be the same as ${INDEX_FILE}`);
}

function checkAddFileRequestData(
  description: FormDataEntryValue | null,
  files: FormDataEntryValue[],
) {
  if (!description || !(typeof description == "string"))
    throw new Error("Missing form data fields: description");
  if (files && !files.every((file) => file instanceof File))
    throw new Error("Wrong form data format: files");
}
