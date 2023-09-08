import TracerAPI from "@/TracerAPI";
import {
  CLIENT_VIEW_PAGE_LOCATION,
  GS1_DATA_LINK_BATCH_PREFIX,
} from "@/properties";
import EthSymbol from "@/public/images/eth-symbol";
import GithubSymbol from "@/public/images/github-symbol";
import Logo from "@/public/images/logo";
import Image from "next/image";

export default function Home() {
  const defaultContractAddress =
    TracerAPI.deployedAddresses["mockTraceabilityContract"];
  const defaultBatchId = TracerAPI.deployedAddresses["mockBatchId"];

  const encodedBatchURL = TracerAPI.Utils.encodeBatchURI(
    defaultBatchId,
    defaultContractAddress,
  );

  const exampleViewPath = `${CLIENT_VIEW_PAGE_LOCATION}/${GS1_DATA_LINK_BATCH_PREFIX}/${encodedBatchURL}`;

  const githubURL = process.env.NEXT_PUBLIC_GITHUB_REPO || "https://github.com";

  return (
    <div className="min-h-screen flex-col bg-isabelline py-4">
      {/* Header Menu */}
      <header className="flex-none pb-4 text-black">
        <div className="container mx-auto flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="h-16 w-16">
            <Logo className="fill-gray-600" />
          </div>
          {/* Navigation Menu */}
          <nav>
            <ul className="flex space-x-4 font-display font-semibold text-gray-600">
              <li>
                <a
                  className="rounded-3xl px-4 py-2 ring-2 ring-gray-600 hover:bg-white hover:shadow-lg md:px-6"
                  href={exampleViewPath}
                >
                  View
                </a>
              </li>
              <li>
                <a
                  href="/management"
                  className="rounded-3xl px-4 py-2 ring-2 ring-gray-600 hover:bg-white hover:shadow-lg md:px-6"
                >
                  Manage
                </a>
              </li>
              <li>
                <a
                  href="/dao"
                  className="rounded-3xl px-4 py-2 ring-2 ring-gray-600 hover:bg-white hover:shadow-lg md:px-6"
                >
                  Governance
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="container relative mx-auto w-full max-w-[80%] grow pb-8 pt-2">
        <div className="relative">
          <div className="absolute inset-1 transform rounded-xl bg-gradient-to-r from-brunswick_green to-brown_sugar blur-lg"></div>
          <div className="relative max-h-[90%] overflow-clip">
            <Image
              src="/images/clientViewScreenshotSmall.png"
              width="450"
              height="750"
              sizes={"100vw"}
              className="h-auto w-full rounded-xl"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcUA8AAeUBMdl0U3EAAAAASUVORK5CYII"
              alt="cv-screenshot"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-isabelline to-65%"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 mx-auto mb-10 flex w-4/5 flex-col items-center font-body">
            <h1 className="mb-1 font-display text-3xl font-black">Tracer</h1>
            <h2 className="font-display text-lg">
              Blockchain-Based Traceability
            </h2>
            <EthSymbol className="my-2 h-10" />
            <div className="mb-4 whitespace-break-spaces text-center text-sm text-gray-700">
              <p>Ethereum (EVM) decentralized application.</p>
              <p>Manage your supply chain with transparency and security.</p>
            </div>
            <a
              href={exampleViewPath}
              className="rounded-xl bg-brunswick_green px-4 py-2 text-white hover:bg-brunswick_green-400"
            >
              Try Demo
            </a>
          </div>
        </div>
      </main>

      {/* GitHub Button */}
      <footer className="mx-auto h-10 w-10">
        <a
          href={githubURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-500"
        >
          <GithubSymbol />
        </a>
      </footer>
    </div>
  );
}
