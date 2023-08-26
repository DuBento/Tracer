import ExpandIcon from "@/public/images/expandIcon";
import { SVGProps } from "react";

type Props = {
  ids: string[];
  batchId: string;
  contractAddress: string;
};

const mockValues = [
  {
    owner: "Continente",
    date: "Jun 18, 2023",
    hour: "10:00",
    events: [
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
    ],
  },
  {
    owner: "UPS",
    date: "May 11, 2023",
    hour: "10:00",
    events: [
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
    ],
  },
  {
    owner: "Leziria Distribution Center in Almeirim",
    date: "May 10, 2023",
    hour: "10:00",
    events: [
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
    ],
  },
  {
    owner: "Adega de Almeirim",
    date: "May 08, 2023",
    hour: "10:00",
    events: [
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
      {
        description: "Storage conditions",
        date: "Jun 18, 2023",
        hour: "10:00",
        files: ["TODO"],
      },
    ],
  },
];

export default function Log(props: Props) {
  return (
    <div className="h-screen w-screen bg-isabelline px-8 pb-2 pt-8">
      <ol className="-pt-2 border-l-[2px] border-brunswick_green">
        {mockValues.map((value, idx) => (
          <li key={idx}>
            <div className="flex items-start justify-between gap-4 align-top">
              <div className="z-10 -ml-[15px] h-[23px] w-[21px] flex-none">
                <LogBulletPointMiddle className="fill-brunswick_green" />
              </div>
              {/* <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-brunswick_green dark:bg-brunswick_green-500"></div> */}
              <h4 className="-mt-2 flex-grow text-xl font-semibold">
                {value.owner}
              </h4>
              <div className="mt-1 h-4 flex-none">
                <ExpandIcon className="fill-brunswick_green-400" />
              </div>
            </div>
            <div className="mb-6 ml-6 pb-6 text-xs">{value.date}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const LogBulletPointMiddle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className={props.className}
    width="100%"
    height="100%"
    viewBox="0 0 21 23"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <rect x={3} y={2} width={17} height={20} fill="#EEECE8" />
    <circle cx={14} cy={7} r={7} />
    <path d="M2 7C2 6.44772 1.55228 6 1 6C0.447715 6 0 6.44772 0 7H2ZM8.08871 17.5638L7.79758 18.5204L7.79758 18.5204L8.08871 17.5638ZM10.5202 18.3037L10.8113 17.347L10.8113 17.347L10.5202 18.3037ZM0 7V7.99692H2V7H0ZM7.79758 18.5204L10.2291 19.2604L10.8113 17.347L8.37983 16.6071L7.79758 18.5204ZM10.2291 19.2604C11.8751 19.7613 13 21.2795 13 23H15C15 20.3992 13.2995 18.1042 10.8113 17.347L10.2291 19.2604ZM0 7.99692C0 12.8385 3.16568 17.1109 7.79758 18.5204L8.37984 16.6071C4.5901 15.4538 2 11.9583 2 7.99692H0Z" />
  </svg>
);
