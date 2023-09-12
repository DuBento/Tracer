import { connectSigner } from "@/TracerAPI/connection";
import { Provider, keccak256, toUtf8Bytes, verifyMessage } from "ethers";

export const FORMDATA_SIGNATURE_KEY = "signature";
export const FORMDATA_TIMESTAMP_KEY = "timestamp";

async function ethTimestamp(provider: Provider | null): Promise<number> {
  if (!provider) throw new Error("Unable to comunicate with blockchain");
  const block = await provider.getBlock("latest");
  if (!block) throw new Error("Unable to comunicate with blockchain");
  return block.timestamp;
}

const CryptoService = {
  ethSignFormData: (formData: FormData): Promise<string> =>
    connectSigner().then(async (signer) => {
      // Additional coponents for security
      formData.append(
        FORMDATA_TIMESTAMP_KEY,
        (await ethTimestamp(signer.provider)).toString(),
      );

      const digest = CryptoService.digestFormData(formData);
      return signer.signMessage(digest);
    }),

  digestFormData: (formData: FormData): string => {
    // Convert the FormData object to a string
    const formDataString = Array.from(formData.entries())
      .filter((entry) => entry[0] != FORMDATA_SIGNATURE_KEY)
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join("&");
    const dataBytes = toUtf8Bytes(formDataString);
    const digest = keccak256(dataBytes);
    return digest;
  },

  verifySignature: (formData: FormData, signature: string): string => {
    const digest = CryptoService.digestFormData(formData);
    const signer = verifyMessage(digest, signature);
    return signer;
  },
};

export default CryptoService;
