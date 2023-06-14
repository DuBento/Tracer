const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
if (!gateway) throw new Error("Undefined gateway for storage service");

export const STORAGE_API_ADD = "/api/storage/add";

export const INDEX_FILE = "index.json";

interface UpdateIndexDocument {
  desc: string;
  imgs: string[];
  vids: string[];
  txt: string[];
  docs: string[];
}

export const composeMetadata = (
  description: string,
  files: File[]
): UpdateIndexDocument => {
  const metadata: UpdateIndexDocument = {
    desc: description,
    imgs: [],
    vids: [],
    txt: [],
    docs: [],
  };

  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      metadata.imgs.push(file.name);
    } else if (file.type.startsWith("video/")) {
      metadata.vids.push(file.name);
    } else if (file.type.startsWith("text/")) {
      metadata.txt.push(file.name);
    } else {
      metadata.docs.push(file.name);
    }
  });

  return metadata;
};

const StorageService = {
  fetchDocument: async (uri: string): Promise<any> => {
    console.log(`Fetching ${new URL(uri, gateway)}`);
    return fetch(new URL(uri, gateway), { method: "GET" }).then((res) => {
      console.log(res.ok);
      if (!res.ok) throw new Error(`Storage error: ${res.text()}`);
      return res.json();
    });
  },

  uploadDocuments: async (
    description: string,
    files: File[]
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("description", description);
    files.forEach((file) => formData.append("file", file));
    return await fetch(STORAGE_API_ADD, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      console.log(res.ok);
      if (!res.ok) throw new Error(`Storage error: ${await res.text()}`);
      return await res.text();
    });
  },
};

export default StorageService;
