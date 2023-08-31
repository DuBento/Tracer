import Header from "@/components/clientView/header";
import Log from "@/components/clientView/log";
import LogContainer from "@/components/clientView/logContainer";
import { GS1_DATA_LINK_BATCH_PREFIX } from "@/properties";
import TracerAPI from "@/TracerAPI";

interface Props {
  params: {
    ids: string[];
  };
}

export default async function ViewPage({ params }: Props) {
  const prefixBatchURI = params.ids.indexOf(GS1_DATA_LINK_BATCH_PREFIX);
  const batchURI = decodeURIComponent(params.ids[prefixBatchURI + 1]);

  const { batchId, contractAddress } = TracerAPI.Utils.decodeBatchURI(batchURI);

  // TODO sanitization
  console.log("contractAddress", contractAddress);

  const managerAddress =
    await TracerAPI.Traceability.getContractManagerAddress(contractAddress);

  console.log("managerAddress", managerAddress);

  const contractDescription =
    await TracerAPI.Traceability.getContractDescription(contractAddress);

  console.log("contractDescription", contractDescription);

  const member = await TracerAPI.UserRegistry.getMember(managerAddress);

  let batch = await TracerAPI.Traceability.getBatch(contractAddress, batchId);
  if (!batch.id) throw new Error("Batch not found.");

  batch = await TracerAPI.Utils.humanizeBatch(batch);
  console.log("batch", batch);

  return (
    <LogContainer>
      <div className="sticky top-0 z-50 w-screen">
        <Header member={member} contractDescription={contractDescription} />
      </div>
      <div className="w-screen whitespace-normal break-words">
        <Log
          ids={params.ids}
          batchId={batchId.toString()}
          contractAddress={contractAddress}
        />
      </div>
    </LogContainer>
  );
}
