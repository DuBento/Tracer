import "@/styles/globals.css";

export const metadata = {
  title: "Thesis",
  description: "Blockchain Traceability System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
