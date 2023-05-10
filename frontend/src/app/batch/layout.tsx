import BatchProvider from "@/context/batchContext";

export default function BatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BatchProvider>{children}</BatchProvider>;
}
