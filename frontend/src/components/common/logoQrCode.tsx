import NotificationContext from "@/context/notificationContext";
import Logo from "@/public/images/logo";
import { toString as qrcodeToString } from "qrcode";
import { useContext, useEffect, useState } from "react";

interface LogoQrCodeProps {
  url: string;
  imageSize: number;
}

const LogoQrCode = ({ url, imageSize }: LogoQrCodeProps) => {
  const { error } = useContext(NotificationContext);

  const [qrCode, setQrCode] = useState<string>();

  useEffect(() => {
    generateQrCode()
      .then((qrcodeSVG) => setQrCode(qrcodeSVG))
      .catch((err) => {
        error("QR Code could not be generated.");
      });
  });

  async function generateQrCode() {
    return qrcodeToString(url, {
      errorCorrectionLevel: "M",
      type: "svg",
      margin: 2,
    });
  }

  if (!qrCode) return null;

  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <svg dangerouslySetInnerHTML={{ __html: qrCode }} />
      <circle cx="60" cy="60" r="12" fill="#ffffff" />
      <svg height="20" width="20" x="50" y="50" preserveAspectRatio="none">
        <Logo className="fill-black" />
      </svg>
    </svg>
  );
};

export default LogoQrCode;
