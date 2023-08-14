import Header from "@/components/clientView/header";
import { GS1_DATA_LINK_BATCH_PREFIX } from "@/properties";
import BlockchainServices from "@/services/BlockchainServices";

interface Props {
  params: {
    ids: string[];
  };
}

export default async function ViewPage({ params }: Props) {
  const prefixBatchURI = params.ids.indexOf(GS1_DATA_LINK_BATCH_PREFIX);
  const batchURI = decodeURIComponent(params.ids[prefixBatchURI + 1]);

  const { batchId, contractAddress } =
    BlockchainServices.Utils.decodeBatchURI(batchURI);

  // TODO sanitization
  console.log("contractAddress", contractAddress);

  const managerAddress =
    await BlockchainServices.Traceability.getContractManagerAddress(
      contractAddress,
    );

  console.log("managerAddress", managerAddress);

  return (
    <>
      <Header
        memberName="Member Name"
        contractDescription="Contract Description"
      />
      <div>Ids: {params.ids.join("/")}</div>
      <div>
        Batch ({batchId.toString()}) and contract ({contractAddress})
      </div>
    </>
  );
}
