import { useRef, useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../public/fonts/stylesheet.css";
import invitationImg from "../assets/images/natcon_2025.png";
import invitationTeamImg from "../assets/images/natcon_2025.png";

const defaultAwardee = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  team: null,
};

function formatFirstName(str) {
  let formattedStr = str;
  const strToFormat = formattedStr.toLowerCase();
  const isCombined = strToFormat.includes(" and ");
  if (isCombined) {
    const names = strToFormat.split(" and ");
    const namesArray = [];
    formattedStr = "";
    names.forEach((name) => {
      const max = 2;
      const chars = name.split(" ");
      const romanNumeralPattern =
        /\bM{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/gi;
      let temp = name;
      if (chars.length > max && !romanNumeralPattern.test(name)) {
        chars.pop();
        temp = chars.join(" ");
      }
      namesArray.push(temp.replace(/\bmaria\b/gi, "ma."));
    });
    formattedStr = namesArray.join(" and ");
  }
  return formattedStr;
}

const InvitationGenerator = () => {
  const [awardee, setAwardee] = useState(defaultAwardee);
  const canvasRef = useRef(null);

  const drawInvitation = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let fullName =
      awardee?.team?.toUpperCase() ??
      `${formatFirstName(awardee.firstName)} ${awardee.lastName}`.toUpperCase();
    const img = new window.Image();
    img.src = awardee?.team === null ? invitationImg : invitationTeamImg;

    const loadFont = async () => {
      const fontBold = new window.FontFace(
        "Gempire",
        "url(/fonts/Gempire-Bold.woff)",
        { weight: "bold" }
      );
      const fontRegular = new window.FontFace(
        "Gempire",
        "url(/fonts/Gempire-Regular.woff)",
        { weight: "normal" }
      );
      await fontBold.load();
      await fontRegular.load();
      document.fonts.add(fontBold);
      document.fonts.add(fontRegular);
      return fontBold;
    };

    img.onload = async () => {
      await loadFont();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Declare shared variables for all logic branches
      let fontSize = 175;
      let textWidth, x, yName, ySubtitle;
      let isTwoLine = false;

      // --- NEW LOGIC FOR 'AND' NAMES ---
      console.log(`Full Name Problem : ${fullName}`);
      let andMatch = fullName.match(/\s*&\s*/i);
      // if (andMatch) {
      //   // Remove 'AND' or '&' and split names
      //   let [name1, name2] = fullName
      //     .split(/\s*&\s*/i)
      //     .map((s) => s.trim());

      //   // Ensure name1 and name2 are defined without truncating
      //   if (!name1) name1 = "";
      //   if (!name2) name2 = "";
      //   // Check if name1 has two words
      //   if (name1.split(" ").length > 1) {
      //     console.log(`1st condition`);
      //     // name1 (line 1), 'AND name2' (line 2)
      //     context.shadowColor = "rgba(0, 0, 0, 0.5)";
      //     context.shadowOffsetX = 10;
      //     context.shadowOffsetY = 10;
      //     context.shadowBlur = 20;
      //     context.fillStyle = "#EFC124";
      //     // Adjust font size for both lines independently
      //     let fontSize1 = fontSize;
      //     let fontSize2 = fontSize;
      //     let name1Width, xName1;

      //     // 'AND name2' on next line, adjust font size if needed
      //     let andName2 = `& ${name2}`;
      //     let name2Width, xName2;
      //     do {
      //       context.font = `bold ${fontSize2}px Cinzel`;
      //       name2Width = context.measureText(andName2).width;
      //       xName2 = 2370 - name2Width;
      //       if (name2Width > 1725) fontSize2 -= 5;
      //     } while (name2Width > 1725 && fontSize2 > 20);
      //     let y2 = 650 + fontSize2 + 10;
      //     context.font = `bold ${fontSize2}px Cinzel`;
      //     context.fillText(andName2, xName2, y2);
      //     ySubtitle = y2 + 100;

      //     // Adjust font size of the first line to match the second line
      //     fontSize1 = fontSize2;
      //     do {
      //       context.font = `bold ${fontSize1}px Cinzel`;
      //       name1Width = context.measureText(name1).width;
      //       xName1 = 2370 - name1Width;
      //       if (name1Width > 1725) fontSize1 -= 5;
      //     } while (name1Width > 1725 && fontSize1 > 20);
      //     let y1 = y2 - fontSize1 - 10;
      //     context.font = `bold ${fontSize1}px Cinzel`;
      //     context.fillText(name1, xName1, y1);
      //   } else {
      //     console.log(`2nd condition`);
      //     // name1 AND (line 1), name2 (line 2)
      //     context.shadowColor = "rgba(0, 0, 0, 0.5)";
      //     context.shadowOffsetX = 10;
      //     context.shadowOffsetY = 10;
      //     context.shadowBlur = 20;
      //     context.fillStyle = "#EFC124";
      //     // Adjust font size for both lines
      //     let name1Width, andWidth, name2Width, xName1, xAnd, xName2;
      //     let fontSizeName2 = fontSize;
      //     do {
      //       context.font = `bold ${fontSizeName2}px Cinzel`;
      //       name2Width = context.measureText(name2).width;
      //       xName2 = 2370 - name2Width;
      //       if (name2Width > 1700) fontSizeName2 -= 5;
      //     } while (name2Width > 1700 && fontSizeName2 > 20);
      //     let y2 = 650 + fontSizeName2 + 10;
      //     context.font = `bold ${fontSizeName2}px Cinzel`;
      //     context.fillText(name2, xName2, y2);
      //     ySubtitle = y2 + 125;

      //     // Draw name1 and 'AND' on the first line
      //     context.font = `bold ${fontSizeName2}px Cinzel`;
      //     name1Width = context.measureText(name1).width;
      //     andWidth = context.measureText("&").width;
      //     xName1 = 2200 - name1Width;
      //     let y1 = y2 - fontSizeName2 - 10;
      //     context.fillText(name1, xName1, y1);
      //     // '&' on same line, right after name1
      //     context.font = `bold ${fontSizeName2}px Cinzel`;
      //     xAnd = xName1 + name1Width + 20;
      //     context.fillText("&", xAnd, y1);
      //   }
      if (andMatch) {
        // Remove 'AND' or '&' and split names
        let [name1, name2] = fullName.split(/\s*&\s*/i).map((s) => s.trim());

        // Ensure name1 and name2 are defined without truncating
        if (!name1) name1 = "";
        if (!name2) name2 = "";
        // Check if name1 has two words
        console.log(`1st condition`);
        // name1 (line 1), 'AND name2' (line 2)
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowOffsetX = 10;
        context.shadowOffsetY = 10;
        context.shadowBlur = 20;
        context.fillStyle = "#EFC124";
        // Adjust font size for both lines independently
        let fontSize1 = fontSize;
        let fontSize2 = fontSize;
        let name1Width, xName1;

        // 'AND name2' on next line, adjust font size if needed
        let andName2 = `& ${name2}`;
        let name2Width, xName2;
        do {
          context.font = `bold ${fontSize2}px Cinzel`;
          name2Width = context.measureText(andName2).width;
          xName2 = 2370 - name2Width;
          if (name2Width > 1725) fontSize2 -= 5;
        } while (name2Width > 1725 && fontSize2 > 20);
        let y2 = 650 + fontSize2 + 10;
        context.font = `bold ${fontSize2}px Cinzel`;
        context.fillText(andName2, xName2, y2);
        ySubtitle = y2 + 120;

        // Adjust font size of the first line to match the second line
        fontSize1 = fontSize2;
        do {
          context.font = `bold ${fontSize1}px Cinzel`;
          name1Width = context.measureText(name1).width;
          xName1 = 2370 - name1Width;
          if (name1Width > 1725) fontSize1 -= 5;
        } while (name1Width > 1725 && fontSize1 > 20);
        let y1 = y2 - fontSize1 - 10;
        context.font = `bold ${fontSize1}px Cinzel`;
        context.fillText(name1, xName1, y1);
      } else {
        context.font = `bold ${fontSize}px Cinzel`;
        context.textAlign = "left";
        context.textBaseline = "middle";
        textWidth = context.measureText(fullName).width;

        if (textWidth > 2000) {
          console.log(`3rd condition`);
          isTwoLine = true;
          // Draw first name on one line, last name on the next
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";
          // Center both lines
          let firstName =
            awardee?.team?.toUpperCase() ??
            formatFirstName(awardee.firstName).toUpperCase();
          // No truncation: use full firstName
          let fontSizeFirst = fontSize;
          let firstNameWidth, xFirst;
          do {
            context.font = `bold ${fontSizeFirst}px Cinzel`;
            firstNameWidth = context.measureText(firstName).width;
            xFirst = 2370 - firstNameWidth;
            if (firstNameWidth > 1700) fontSizeFirst -= 5;
          } while (firstNameWidth > 1700 && fontSizeFirst > 20);
          const lastName = awardee?.team?.toUpperCase()
            ? ""
            : awardee.lastName.toUpperCase();
          const lastNameWidth = context.measureText(lastName).width;
          const xLast = 2370 - lastNameWidth;
          yName = 650;
          context.font = `bold ${fontSizeFirst}px Cinzel`;
          context.fillText(firstName, xFirst, yName);
          if (!awardee?.team) {
            yName += fontSizeFirst + 10;
            context.font = `bold ${fontSizeFirst}px Cinzel`;
            context.fillText(lastName, xLast, yName);
          }
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
      const subtitle = awardee.subtitle || "VIP | TOP AGENT";
      context.font = `bold 90px 'Times New Roman', Times, serif`;
      context.shadowColor = "rgba(0,0,0,0.4)";
      context.shadowOffsetX = 4;
      context.shadowOffsetY = 4;
      context.shadowBlur = 10;
      context.fillStyle = "#fff";
      // Center the subtitle under the name
      const subtitleWidth = context.measureText(subtitle).width;
      const subtitleX = 2370 - subtitleWidth;
      context.fillText(subtitle, subtitleX, ySubtitle);
    };
  };

  useEffect(() => {
    drawInvitation();
    // eslint-disable-next-line
  }, [awardee]);

  // Simple form for live simulation
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Invitation Generator (Live Preview)</h1>
      <form
        style={{ marginBottom: "2rem" }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="First Name"
          value={awardee.firstName}
          onChange={(e) =>
            setAwardee((a) => ({ ...a, firstName: e.target.value }))
          }
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={awardee.lastName}
          onChange={(e) =>
            setAwardee((a) => ({ ...a, lastName: e.target.value }))
          }
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Team (optional)"
          value={awardee.team || ""}
          onChange={(e) =>
            setAwardee((a) => ({ ...a, team: e.target.value || null }))
          }
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Subtitle (e.g. VIP | TOP AGENT)"
          value={awardee.subtitle || ""}
          onChange={(e) =>
            setAwardee((a) => ({ ...a, subtitle: e.target.value }))
          }
          style={{ marginRight: 8 }}
        />
      </form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas
          ref={canvasRef}
          width={2480}
          height={2404}
          style={{
            border: "2px solid #ccc",
            background: "#fff",
            maxWidth: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default InvitationGenerator;
