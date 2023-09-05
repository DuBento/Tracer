type Props = {
  className: string;
};

export default function Skeleton(props: Props) {
  return (
    <div
      className={`rounded-md bg-gray-300/50 motion-safe:animate-pulse ${props.className}`}
    />
  );
}
