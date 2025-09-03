import { useRef, useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../public/fonts/stylesheet.css";
import invitationImg from "../assets/images/invitation_2025.png";
import invitationTeamImg from "../assets/images/invitation_team.png";

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
      let fontSize = 150;
      let textWidth, x, yName, ySubtitle;
      let isTwoLine = false;

      // --- NEW LOGIC FOR 'AND' NAMES ---
      let andMatch = fullName.match(/\bAND\b/i);
      if (andMatch) {
        // Remove 'AND' and split names
        let [name1, name2] = fullName.split(/\bAND\b/i).map((s) => s.trim());
        // Check if name1 has two words
        if (name1.split(" ").length > 1) {
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
          do {
            context.font = `bold ${fontSize1}px Gempire`;
            name1Width = context.measureText(name1).width;
            xName1 = 2450 - name1Width;
            if (name1Width > 2200) fontSize1 -= 5;
          } while (name1Width > 2200 && fontSize1 > 20);
          let y1 = 850;
          context.font = `bold ${fontSize1}px Gempire`;
          context.fillText(name1, xName1, y1);

          // 'AND name2' on next line, adjust font size if needed
          let andName2 = `AND ${name2}`;
          let name2Width, xName2;
          do {
            context.font = `bold ${fontSize2}px Gempire`;
            name2Width = context.measureText(andName2).width;
            xName2 = 2450 - name2Width;
            if (name2Width > 2200) fontSize2 -= 5;
          } while (name2Width > 2200 && fontSize2 > 20);
          let y2 = y1 + fontSize2 + 10;
          context.font = `bold ${fontSize2}px Gempire`;
          context.fillText(andName2, xName2, y2);
          ySubtitle = y2 + 100;
        } else {
          // name1 AND (line 1), name2 (line 2)
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";
          // Adjust font size for both lines
          let name1Width, andWidth, name2Width, xName1, xAnd, xName2;
          context.font = `bold ${fontSize}px Gempire`;
          name1Width = context.measureText(name1).width;
          andWidth = context.measureText("AND").width;
          xName1 = 1975 - name1Width;
          let y1 = 850;
          context.fillText(name1, xName1, y1);
          // 'AND' on same line, right after name1
          context.font = `bold ${fontSize}px Gempire`;
          xAnd = xName1 + name1Width + 20;
          context.fillText("AND", xAnd, y1);
          // name2 on next line
          context.font = `bold ${fontSize}px Gempire`;
          name2Width = context.measureText(name2).width;
          xName2 = 2450 - name2Width;
          let y2 = y1 + fontSize + 10;
          context.fillText(name2, xName2, y2);
          ySubtitle = y2 + 100;
        }
      } else {
        // --- EXISTING LOGIC ---
        // Calculate textWidth and x for fallback logic
        do {
          context.font = `bold ${fontSize}px Gempire`;
          context.textAlign = "left";
          context.textBaseline = "middle";
          textWidth = context.measureText(fullName).width;
          x = 2450 - textWidth;
          if (x < 180) {
            fontSize -= 5;
          }
        } while (x < 180 && fontSize > 20);
        if (textWidth > 1800) {
          isTwoLine = true;
          // Draw first name on one line, last name on the next
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";
          // Center both lines
          const firstName =
            awardee?.team?.toUpperCase() ??
            formatFirstName(awardee.firstName).toUpperCase();
          const lastName = awardee?.team?.toUpperCase()
            ? ""
            : awardee.lastName.toUpperCase();
          const firstNameWidth = context.measureText(firstName).width;
          const lastNameWidth = context.measureText(lastName).width;
          const xFirst = 2450 - firstNameWidth;
          const xLast = 2450 - lastNameWidth;
          yName = 850;
          context.fillText(firstName, xFirst, yName);
          if (!awardee?.team) {
            yName += fontSize + 10;
            context.fillText(lastName, xLast, yName);
          }
          ySubtitle = yName + 100;
        } else {
          // Single line as before
          context.shadowColor = "rgba(0, 0, 0, 0.5)";
          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.fillStyle = "#EFC124";
          context.fillText(fullName, x, 890);
          ySubtitle = 850 + fontSize;
        }
      }

      // Draw 'VIP | TOP AGENT' below the name (dynamic y)
      const subtitle = "VIP | TOP AGENT";
      context.font = `normal 90px Gempire`;
      context.shadowColor = "rgba(0,0,0,0.4)";
      context.shadowOffsetX = 4;
      context.shadowOffsetY = 4;
      context.shadowBlur = 10;
      context.fillStyle = "#fff";
      // Center the subtitle under the name
      const subtitleWidth = context.measureText(subtitle).width;
      const subtitleX = 2450 - subtitleWidth;
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
