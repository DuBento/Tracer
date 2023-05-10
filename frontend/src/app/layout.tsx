import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

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
      <body>
        <Toaster position="bottom-left" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
