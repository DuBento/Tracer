import "@/styles/globals.css";
import { Lato, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "300"],
  variable: "--font-lato",
});

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
    <html
      lang="en"
      className={`h-full w-full ${montserrat.variable} ${lato.variable}`}
    >
      <body>
        <Toaster position="bottom-left" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
