const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY;

if (!gateway) throw new Error("Undefined gateway for storage service");

const StorageService = {
  fetchDocument: async (uri: string): Promise<any> => {
    console.log(`Fetching ${new URL(uri, gateway)}`);
    return fetch(new URL(uri, gateway), { method: "GET" }).then((res) =>
      res.text()
    );
  },
};

export default StorageService;
