"use client";

import StorageService from "@/services/StorageService";
import Image from "next/image";
import useSWR from "swr";

interface DocumentContainerProps {
  uri: string;
}

const DocumentContainer = ({ uri }: DocumentContainerProps) => {
  const { data, error, isLoading } = useSWR(
    uri,
    StorageService.fetchIndexDocument
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  // render data
  return (
    <div className="p-2">
      <p className="pb-2 text-sm text-gray-900">{data?.desc}</p>

      <div
        className="grid items-center justify-center align-middle grid-flow-row-dense gap-4
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {data?.imgs.map((filename, idx) => (
          <div
            key={`img${idx}`}
            className="relative grow aspect-[16/12] shadow-lg"
          >
            <Image
              src={StorageService.generateResourceURL(uri, filename).toString()}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute object-cover inset-0 w-full h-full rounded-lg"
              placeholder="blur"
              blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8s3RpPQAHsgLHRM/5kQAAAABJRU5ErkJggg=="
              alt={filename}
            />
          </div>
        ))}

        {data?.vids.map((filename, idx) => (
          <div
            key={`vids${idx}`}
            className="col-span-2 aspect-video rounded-lg overflow-hidden shadow-lg"
          >
            <video loop controls muted>
              <source
                src={StorageService.generateResourceURL(
                  uri,
                  filename
                ).toString()}
              />
            </video>
          </div>
        ))}

        {data?.txt.map((filename, idx) => (
          <div
            key={`txt${idx}`}
            className="col-span-2 aspect-video rounded-lg shadow-lg
            w-full h-full p-2 font-mono overflow-auto"
          >
            <DocumentText uri={uri} filename={filename} />
          </div>
        ))}

        {data?.pdf.map((filename, idx) => (
          <div
            key={`txt${idx}`}
            className="col-span-2 aspect-video rounded-lg shadow-lg"
          >
            <iframe
              className="w-full h-full font-mono border border-gray-300 rounded-lg"
              src={StorageService.generateResourceURL(uri, filename).toString()}
            />
          </div>
        ))}

        {data?.other.map((filename, idx) => (
          <div
            key={`txt${idx}`}
            className="p-2 aspect-video rounded-lg shadow-lg"
          >
            <a
              href={StorageService.generateResourceURL(
                uri,
                filename
              ).toString()}
              download
              className="flex justify-center items-center h-full m-auto"
            >
              <div className="text-center text-bluegray-500 font-mono font-bold max-w-full text-ellipsis overflow-hidden">
                <svg
                  className="h-16 w-16 m-auto"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                </svg>
                <p>{filename}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentContainer;

interface DocumentTextProps {
  uri: string;
  filename: string;
}

const DocumentText = ({ uri, filename }: DocumentTextProps) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.text());
  const { data, error, isLoading } = useSWR(
    StorageService.generateResourceURL(uri, filename).toString(),
    fetcher
  );

  if (error) return <pre>failed to load</pre>;
  if (isLoading)
    return (
      <div role="status" className="w-full animate-pulse">
        <div className="h-2.5 w-3/4 bg-gray-200 rounded-full dark:bg-bluegray-500 mb-4"></div>
        <div className="h-2.5 w-2/4 bg-gray-200 rounded-full dark:bg-bluegray-500 mb-4"></div>
      </div>
    );

  return <pre className="whitespace-pre-wrap">{data}</pre>;
};
