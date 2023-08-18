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

  const contractDescription =
    await BlockchainServices.Traceability.getContractDescription(
      contractAddress,
    );

  console.log("contractDescription", contractDescription);

  const member = await BlockchainServices.UserRegistry.getMember(
    managerAddress,
  );

  return (
    <div className="relative">
      <div className="sticky top-0 z-50 w-screen">
        <Header member={member} contractDescription={contractDescription} />
      </div>
      <div className="w-screen whitespace-normal break-words">
        <div>Ids: {params.ids.join("/")}</div>
        <div>
          Batch ({batchId.toString()}) and contract ({contractAddress})
        </div>
        <div className="h-screen bg-slate-400"></div>
      </div>
    </div>
  );
}
