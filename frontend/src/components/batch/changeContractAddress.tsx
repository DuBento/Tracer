import { useState } from "react";

type Props = {
  contractAddress: string;
  setContractAddress: (newAddress: string) => void;
};

export default function ChangeContractAddress(props: Props) {
  const [open, setOpen] = useState(false);
  const [newContractAddress, setNewContractAddress] = useState(
    props.contractAddress,
  );

  return (
    <>
      <button
        className="rounded bg-red-300 px-2 py-1.5 font-bold hover:bg-red-200 hover:font-extrabold hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <SettingsIcon className="h-6 w-6 fill-current text-white" />
      </button>

      {open && (
        <div
          className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-auto bg-black/20 p-4 shadow-lg"
          onClick={() => setOpen(!open)}
        >
          <div
            className="overflow-hidden rounded-lg bg-platinum p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono font-bold leading-6 text-black">
              Contract address
            </p>
            <div className="my-2">
              <input
                type="text"
                autoComplete="off"
                className="block w-full rounded-md border-0 bg-isabelline 
              py-1.5 text-black shadow ring-1 ring-inset ring-coolgray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-brunswick_green sm:text-sm sm:leading-6"
                value={newContractAddress}
                onChange={(e) => setNewContractAddress(e.target.value)}
              />
            </div>
            <button
              className="my-4 rounded bg-red-300 px-2 py-1.5 font-bold hover:bg-red-200 hover:font-extrabold hover:text-white"
              onClick={() => {
                props.setContractAddress(newContractAddress);
                setOpen(false);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={props.className}
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path d="M555-80H405q-15 0-26-10t-13-25l-12-93q-13-5-24.5-12T307-235l-87 36q-14 5-28 1t-22-17L96-344q-8-13-5-28t15-24l75-57q-1-7-1-13.5v-27q0-6.5 1-13.5l-75-57q-12-9-15-24t5-28l74-129q7-14 21.5-17.5T220-761l87 36q11-8 23-15t24-12l12-93q2-15 13-25t26-10h150q15 0 26 10t13 25l12 93q13 5 24.5 12t22.5 15l87-36q14-5 28-1t22 17l74 129q8 13 5 28t-15 24l-75 57q1 7 1 13.5v27q0 6.5-2 13.5l75 57q12 9 15 24t-5 28l-74 128q-8 13-22.5 17.5T738-199l-85-36q-11 8-23 15t-24 12l-12 93q-2 15-13 25t-26 10Zm-73-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" />
  </svg>
);
