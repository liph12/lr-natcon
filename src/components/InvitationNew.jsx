import { useRef, useEffect } from "react";
import "../../public/fonts/stylesheet.css";
import invitationImg from "../assets/images/natcon_2025.png";

const InvitationNew = ({ awardee, setCanvas }) => {
  const canvasRef = useRef(null);

  const drawInvitation = () => {
    const { firstName, lastName, fullName, subtitle } = awardee;

    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas reference is null.");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get canvas context.");
      return;
    }

    const img = new window.Image();
    img.src = invitationImg;

    img.onerror = () => {
      console.error("Failed to load the invitation image.");
    };

    const fontSize = 175; // Initialize fontSize
    let textWidth = 0; // Initialize textWidth
    let ySubtitle = 0; // Initialize ySubtitle
    let isTwoLine = false;

    const loadFont = async () => {
      const fontBold = new window.FontFace(
        "Gempire",
        "url(/fonts/Gempire-Bold.woff)",
        { weight: "bold" }
      );
      await fontBold.load();
      document.fonts.add(fontBold);
    };

    img.onload = async () => {
      console.log("Image loaded successfully"); // Debugging log
      await loadFont();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      context.font = `bold ${fontSize}px Cinzel`;
      context.textAlign = "left";
      context.textBaseline = "middle";
      textWidth = context.measureText(fullName).width;
      let andMatch = fullName.match(/\s*&\s*/i);
      if (andMatch) {
        // Remove 'AND' or '&' and split names
        let [name1, name2] = fullName.split(/\s*&\s*/i).map((s) => s.trim());

        // Ensure name1 and name2 are defined without truncating
        if (!name1) name1 = "";
        if (!name2) name2 = "";
        // Check if name1 has two words
        // name1 (line 1), '& name2' (line 2)
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowOffsetX = 10;
        context.shadowOffsetY = 10;
        context.shadowBlur = 20;
        context.fillStyle = "#EFC124";
        // Adjust font size for both lines independently
        let fontSize1 = fontSize;
        let fontSize2 = fontSize;
        let name1Width, xName1;

        // '& name2' on next line, adjust font size if needed
        let andName2 = `& ${name2}`;
        let name2Width, xName2;
        do {
          context.font = `bold ${fontSize2}px Cinzel`;
          name2Width = context.measureText(andName2).width;
          xName2 = 2370 - name2Width;
          if (name2Width > 1700) fontSize2 -= 5;
        } while (name2Width > 1700 && fontSize2 > 20);
        let y2 = 650 + fontSize2 + 10;
        context.font = `bold ${fontSize2}px Cinzel`;
        context.fillText(andName2, xName2, y2);
        ySubtitle = y2 + 115;

        // Adjust font size of the first line to match the second line
        fontSize1 = fontSize2;
        do {
          context.font = `bold ${fontSize1}px Cinzel`;
          name1Width = context.measureText(name1).width;
          xName1 = 2370 - name1Width;
          if (name1Width > 1700) fontSize1 -= 5;
        } while (name1Width > 1700 && fontSize1 > 20);
        let y1 = y2 - fontSize1 - 10;
        context.font = `bold ${fontSize1}px Cinzel`;
        context.fillText(name1, xName1, y1);
      } else {
        context.font = `bold ${fontSize}px Cinzel`;
        context.textAlign = "left";
        context.textBaseline = "middle";
        textWidth = context.measureText(fullName).width;
        console.log(`textWidth: ${textWidth}`);
        if (textWidth > 2000) {
          console.log(`3rd condition`);
          isTwoLine = true;
          // Draw first name on one line, last name on the next
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";

          // Adjust font size for firstName if needed
          let fontSizeFirst = fontSize;
          let firstNameWidth, xFirst;
          do {
            context.font = `bold ${fontSizeFirst}px Cinzel`;
            firstNameWidth = context.measureText(firstName).width;
            xFirst = 2370 - firstNameWidth;
            if (firstNameWidth > 1700) fontSizeFirst -= 5;
          } while (firstNameWidth > 1700 && fontSizeFirst > 20);

          const lastNameWidth = context.measureText(lastName).width;
          const xLast = 2370 - lastNameWidth;
          let yName = 650;
          context.font = `bold ${fontSizeFirst}px Cinzel`;
          context.fillText(firstName, xFirst, yName);
          yName += fontSizeFirst + 10;
          context.font = `bold ${fontSizeFirst}px Cinzel`;
          context.fillText(lastName, xLast, yName);
          ySubtitle = yName + 125;
        } else {
          console.log(`4th condition`);
          // Single line as before
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";
          // Calculate x for the current font size and fullName
          let fontSizeSingle = fontSize;
          let singleLineWidth, singleLineX;
          do {
            context.font = `bold ${fontSizeSingle}px Cinzel`;
            singleLineWidth = context.measureText(fullName).width;
            singleLineX = 2370 - singleLineWidth;
            if (singleLineWidth > 1600) fontSizeSingle -= 5;
          } while (singleLineWidth > 1600 && fontSizeSingle > 20);
          context.font = `bold ${fontSizeSingle}px Cinzel`;
          context.fillText(fullName, singleLineX, 750);
          ySubtitle = 700 + fontSizeSingle;
        }
      }

      // Draw 'VIP | TOP AGENT' below the name (dynamic y)
      const subtitleText = subtitle || "VIP | Top Agent";
      context.font = `bold 90px 'Times New Roman', Times, serif`;
      context.shadowColor = "rgba(0,0,0,0.4)";
      context.shadowOffsetX = 4;
      context.shadowOffsetY = 4;
      context.shadowBlur = 10;
      context.fillStyle = "#fff";
      // Center the subtitle under the name
      const subtitleWidth = context.measureText(subtitleText).width;
      const subtitleX = 2370 - subtitleWidth;
      context.fillText(subtitleText, subtitleX, ySubtitle);

      setCanvas(canvas);
    };
  };

  useEffect(() => {
    if (awardee !== null) {
      drawInvitation();
    }
  }, [awardee]);

  return (
    <canvas
      ref={canvasRef}
      width={2480}
      height={2404}
      style={{ display: "none" }}
    />
  );
};

export default InvitationNew;
