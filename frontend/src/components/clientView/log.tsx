"use client";
type Props = {
  ids: string[];
  batchId: string;
  contractAddress: string;
};

export default function Log(props: Props) {
  return (
    <div
      
    >
      <div>Ids: {props.ids.join("/")}</div>
      <div>
        Batch ({props.batchId}) and contract ({props.contractAddress})
      </div>
      <div className="h-screen bg-slate-400"></div>
    </div>
  );
}
