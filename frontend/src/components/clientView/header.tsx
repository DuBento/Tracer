import { BatchLog } from "@/TracerAPI";
import Logo from "@/public/images/logo";
import Info from "./info";

type Props = {
  batchLog: BatchLog;
  contractAddress: string;
};

export default function Header(props: Props) {
  return (
    <div className="bg-wine bg-cover bg-center pb-3">
      <div className="max-w-screen flex min-w-0 flex-row justify-between">
        <div className="m-[10px] h-12 w-12 flex-none">
          <Logo className="fill-isabelline" />
        </div>
        <div className="mx-2 w-2/3 pt-4">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-center font-display text-4xl leading-none text-isabelline">
            {props.batchLog.managerName}
          </p>
          <p className="whites text-center font-display text-xl font-light leading-none text-isabelline">
            {props.batchLog.contractDescription}
          </p>
        </div>
        <div className="m-[10px] h-12 w-12 flex-none py-1 pl-1">
          <Info
            batchLog={props.batchLog}
            contractAddress={props.contractAddress}
          />
        </div>
      </div>
      <div
        id="cv-header-description"
        className="linear max-h-[300px] overflow-hidden transition-maxHeight duration-150"
      >
        <div className="m-auto mt-3 h-fit max-h-max w-10/12 overflow-ellipsis rounded-3xl bg-isabelline px-4 py-1 text-center font-body leading-tight text-black drop-shadow-md">
          {props.batchLog.batchDescription}
        </div>
      </div>
    </div>
  );
}
