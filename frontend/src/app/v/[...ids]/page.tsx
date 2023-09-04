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
  if (!batch.id) return NotFoundPage();

  const batchLog = await TracerAPI.Utils.getBatchLog(batch);
  console.log({ batchLog });
  batchLog.log.map((e) => console.log(e));

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

const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-sage-800">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-4xl font-semibold">No Batch Found</h1>
        <p className="text-gray-600">
          Sorry, the requested batch was not found.
        </p>
      </div>
    </div>
  );
};
