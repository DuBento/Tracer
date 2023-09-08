import Header from "@/components/clientView/header";
import Log from "@/components/clientView/log";
import LogContainer from "@/components/clientView/logContainer";
import Warning from "@/components/clientView/warning";
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

  const batchLog = await TracerAPI.Utils.getBatchLog(contractAddress, batchId);
  if (!batchLog) return NotFoundPage();

  return (
    <LogContainer className="flex h-screen max-h-screen flex-col">
      <div className="sticky top-0 z-50 w-screen">
        <Header batchLog={batchLog} contractAddress={contractAddress} />
      </div>
      {batchLog.warning && (
        <div className="mt-5 w-screen flex-none">
          <Warning />
        </div>
      )}
      <div className="w-screen flex-grow whitespace-normal break-words fill-isabelline">
        <Log batchLog={batchLog} bgFill="fill-isabelline" />
      </div>
    </LogContainer>
  );
}

const NotFoundPage = () => {
  return (
    <a href="/">
      <div className="flex h-screen items-center justify-center bg-sage-800">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">No Batch Found</h1>
          <p className="text-gray-600">
            Sorry, the requested batch was not found.
          </p>
        </div>
      </div>
    </a>
  );
};
