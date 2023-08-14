type Props = { memberName: string; contractDescription: string };

export default function Header(props: Props) {
  return (
    <div>
      <div>Member Name: {props.memberName}</div>
      <div>Contract Description: {props.contractDescription}</div>
    </div>
  );
}
