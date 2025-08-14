import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useState, useRef, useEffect } from "react";
import "../../public/fonts/stylesheet.css";
import invitationImg from "../assets/images/invitation_new.jpg";
import invitationTeamImg from "../assets/images/invitation_team.png";

export default function InvitationCardFinal({ awardee, setCanvas }) {
  const canvasRef = useRef(null);
  const { firstName, lastName, email } = awardee;

  const formatFirstName = (str) => {
    let formattedStr = str;
    const strToFormat = formattedStr.toLowerCase();
    const isCombined = strToFormat.includes(" and ");

    if (isCombined) {
      const names = strToFormat.split(" and ");
      const namesArray = [];
      formattedStr = "";

      names.forEach((name, idx) => {
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
  };

  const drawInvitation = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let fullName =
      awardee?.team?.toUpperCase() ??
      `${formatFirstName(firstName)} ${lastName}`.toUpperCase();
    const img = new Image();
    img.src = awardee?.team === null ? invitationImg : invitationTeamImg; // Load the background image from the provided URL

    const loadFont = async () => {
      const font = new FontFace("Ireene-Bold", "url(/fonts/Ireene-Bold.woff2)");
      await font.load();
      document.fonts.add(font);
      return font;
    };

    img.onload = async () => {
      await loadFont();

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      let fontSize = 180; // Start with initial font size
      let x; // Declare x-coordinate outside loop to use it later

      // Adjust font size until x is greater than 500
      do {
        // Set font properties dynamically
        context.font = `bold ${fontSize}px Ireene-Bold`;
        context.textAlign = "left"; // Set text alignment to 'left' to position based on starting x
        context.textBaseline = "middle"; // Align text vertically to the middle

        // Calculate text width
        const textWidth = context.measureText(fullName).width;

        // Calculate the x-coordinate so that the end of the text aligns with 2300
        x = 2300 - textWidth;

        // Decrease font size if x is less than 500
        if (x < 180) {
          fontSize -= 5; // Adjust this value to control the decrement steps
        }
      } while (x < 180 && fontSize > 20); // Continue adjusting until x is greater than 500 or font size is reasonable

      // Set up text shadow properties
      context.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color with transparency
      context.shadowOffsetX = 10; // Horizontal shadow offset
      context.shadowOffsetY = 10; // Vertical shadow offset
      context.shadowBlur = 20; // Shadow blur
      context.fillStyle = "#EFC124";
      context.fillText(fullName, x, 600);

      setCanvas(canvas);
    };
  };

  useEffect(() => {
    drawInvitation();
  }, [awardee]);

  return (
    <div
      className="card flex flex-column justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div style={{ width: "80%" }}>
        <canvas
          ref={canvasRef}
          width={2480}
          height={2404}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
