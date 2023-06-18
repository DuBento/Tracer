const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
if (!gateway) throw new Error("Undefined gateway for storage service");

export const STORAGE_API_ADD = "/api/storage/add";

export const INDEX_FILE = "index.json";

interface UpdateIndexDocument {
  desc: string;
  imgs: string[];
  vids: string[];
  txt: string[];
  pdf: string[];
  other: string[];
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
    pdf: [],
    other: [],
  };

  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      metadata.imgs.push(file.name);
    } else if (file.type.startsWith("video/")) {
      metadata.vids.push(file.name);
    } else if (file.type.startsWith("text/")) {
      metadata.txt.push(file.name);
    } else if (file.type.match("application/pdf")) {
      metadata.pdf.push(file.name);
    } else {
      metadata.other.push(file.name);
    }
  });

  return metadata;
};

const StorageService = {
  generateResourceURL(uri: string, filename: string): URL {
    return new URL(`${uri}/${filename}`, gateway);
  },

  fetchDocument: async (uri: string, filename: string): Promise<any> => {
    console.log(
      `Fetching ${StorageService.generateResourceURL(uri, filename)}`
    );
    return fetch(StorageService.generateResourceURL(uri, filename), {
      method: "GET",
    }).then(async (res) => {
      if (!res.ok) throw new Error(`${await res.text()}`);
      return res.json();
    });
  },

  fetchIndexDocument: async (uri: string): Promise<UpdateIndexDocument> => {
    return StorageService.fetchDocument(uri, INDEX_FILE);
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
      if (!res.ok) throw new Error(`${await res.text()}`);
      return await res.json();
    });
  },
};

export default StorageService;
