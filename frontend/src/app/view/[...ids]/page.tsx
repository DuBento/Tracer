import { GS1_DATA_LINK_BATCH_PREFIX } from "@/properties";

interface Props {
  params: {
    ids: string[];
  };
}

const ViewPage = ({ params }: Props) => {
  const prefixIdx = params.ids.indexOf(GS1_DATA_LINK_BATCH_PREFIX);
  const id = decodeURIComponent(params.ids[prefixIdx + 1]);
  const [batchId, contractAddress] = id.split("@");

  return (
    <>
      <div>Ids: {params.ids.join("/")}</div>
      <div>
        Batch ({batchId}) and contract ({contractAddress})
      </div>
    </>
  );
};

export default ViewPage;
