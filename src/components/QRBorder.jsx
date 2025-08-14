import { useRef, useState, useEffect } from "react";
import QRBorderImg from "../assets/images/qr-frame-2.png";
import QRCodeStyling from "qr-code-styling";

export default function QRBorder({ awardee, setCanvasQRBorder }) {
  const canvasRef = useRef(null);
  const qrContainerRef = useRef(null);

  const generateQRBorder = () => {
    const { firstName, lastName, qrValue } = awardee;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const logoImage = new Image();

    logoImage.src = QRBorderImg;
    logoImage.onload = async function () {
      context.drawImage(logoImage, 0, 0, canvas.width, canvas.height);

      const qrImage = new Image();
      const qrStyling = new QRCodeStyling({
        width: 3500,
        height: 3500,
        type: "canvas",
        data: qrValue,
        dotsOptions: {
          color: "#EFC124",
          type: "dots",
        },
        backgroundOptions: {
          color: "transparent",
        },
        cornersSquareOptions: {
          type: "dot",
          color: "#EFC124",
        },
        cornersDotOptions: {
          type: "dot",
          color: "#EFC124",
        },
      });

      const loadFont = () => {
        const font = new FontFace(
          "MarketPro-Bold",
          "url(/fonts/MarketPro-Bold.woff2)"
        );
        return font.load().then((loadedFont) => {
          document.fonts.add(loadedFont);
          return loadedFont;
        });
      };

      Promise.all([
        new Promise((resolve) => {
          logoImage.onload = resolve;
        }),
        loadFont(),
      ]).then(() => {
        console.log("Font and image loaded successfully");
      });

      qrStyling.getRawData("png").then((qrBlob) => {
        qrImage.src = URL.createObjectURL(qrBlob);

        qrImage.onload = async () => {
          let text = `${firstName} ${lastName}`;
          text = text.toUpperCase();
          let fontSize = 220;

          context.font = `bold ${fontSize}px MarketPro-Bold`;
          let textWidth = context.measureText(text).width;
          let x = (canvas.width - textWidth) / 2;
          context.fillStyle = "#EFC124";
          context.fillText(text, x, 4330);

          let xPosition = (canvas.width - 3500) / 2;
          let yPosition = (canvas.height - 3500) / 2;
          context.drawImage(qrImage, xPosition, yPosition + 20);

          setCanvasQRBorder(canvas);
        };
      });
    };
  };

  useEffect(() => {
    generateQRBorder();
  }, [awardee]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={4500}
        height={4500}
        style={{ display: "none" }}
      />
      <div ref={qrContainerRef} />
    </>
  );
}
