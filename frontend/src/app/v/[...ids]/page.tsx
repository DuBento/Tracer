import { GS1_DATA_LINK_BATCH_PREFIX } from "@/properties";
import BlockchainServices from "@/services/BlockchainServices";

interface Props {
  params: {
    ids: string[];
  };
}

const ViewPage = ({ params }: Props) => {
  const prefixBatchURI = params.ids.indexOf(GS1_DATA_LINK_BATCH_PREFIX);
  const batchURI = decodeURIComponent(params.ids[prefixBatchURI + 1]);

  const { batchId, contractAddress } =
    BlockchainServices.decodeBatchURI(batchURI);

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
