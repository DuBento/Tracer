import TracerAPI from "@/TracerAPI";
import {
  CLIENT_VIEW_PAGE_LOCATION,
  GS1_DATA_LINK_BATCH_PREFIX,
} from "@/properties";

export default function Home() {
  const defaultContractAddress =
    TracerAPI.deployedAddresses["mockTraceabilityContract"];
  const defaultBatchId = TracerAPI.deployedAddresses["mockBatchId"];

  const encodedBatchURL = TracerAPI.Utils.encodeBatchURI(
    defaultBatchId,
    defaultContractAddress,
  );

  const exampleViewPath = `${CLIENT_VIEW_PAGE_LOCATION}/${GS1_DATA_LINK_BATCH_PREFIX}/${encodedBatchURL}`;

  return (
    <main>
      <h1 className="text-center text-3xl font-bold">
        Supplychain Traceability Blockchain Dapp: Homepage
      </h1>
      <a href={exampleViewPath}>View test</a>
    </main>
  );
}
