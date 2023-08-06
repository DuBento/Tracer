import { GS1_DATA_LINK_BATCH_PREFIX } from "@/properties";
import base64url from "base64url";

interface Props {
  params: {
    ids: string[];
  };
}

const ViewPage = ({ params }: Props) => {
  const prefixIdx = params.ids.indexOf(GS1_DATA_LINK_BATCH_PREFIX);
  const id = decodeURIComponent(params.ids[prefixIdx + 1]);
  const [batchIdB64, contractAddress] = id.split("@");
  const batchId = BigInt(`0x${base64url.decode(batchIdB64, "hex")}`);

  // TODO sanitization

  return (
    <>
      <div>Ids: {params.ids.join("/")}</div>
      <div>
        Batch ({batchId.toString()}) and contract ({contractAddress})
      </div>
    </>
  );
};

export default ViewPage;
