import "primereact/resources/themes/saga-blue/theme.css"; // Import PrimeReact theme
import "primereact/resources/primereact.min.css"; // Import PrimeReact core styles
import "primeicons/primeicons.css"; // Import PrimeIcons
import React, { useState, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button"; // Import PrimeReact Button
import "../../public/fonts/MarketPro-Bold/stylesheet.css"; // Your custom styles
import QRCodeStyling from "qr-code-styling"; // Import QRCodeStyling library

export default function NatconIDGenerator() {
  const [value, setValue] = useState("");
  const [imageList, setImageList] = useState([]);
  const canvasRef = useRef(null);
  const qrContainerRef = useRef(null); // Reference for the off-screen QR code container

  // Function to capitalize the first letter of each word in the name
  // const capitalizeWords = (name) => {
  //   return name
  //     .toLowerCase() // Convert the entire name to lowercase
  //     .split(" ") // Split by spaces
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
  //     .join(" "); // Join the words back together with spaces
  // };

  const capitalizeWords = (name) => {
    return name
      .toUpperCase() // Convert the entire name to uppercase
      .split(" ") // Split by spaces
      .join(" "); // Join the words back together with spaces
  };

  // Function to handle generating invitations
  const handleGenerateClick = async () => {
    // Split the input by new lines to get each name entry
    const entries = value.split("\n").filter((entry) => entry.trim() !== "");

    // Clear previous images and reset the table data
    setImageList([]);

    // Sequentially process each entry to ensure proper drawing
    for (const entry of entries) {
      const [firstName, lastName, url] = entry
        .split(",")
        .map((item) => item.trim());
      if (firstName && lastName && url) {
        await drawInvitation(firstName, lastName, url);
      }
    }
  };

  // Function to draw the invitation
  const drawInvitation = async (firstName, lastName, url) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Capitalize names
    let formattedFirstName = capitalizeWords(firstName);
    let formattedLastName = capitalizeWords(lastName);

    const img = new Image();
    img.crossOrigin = "*"; // Handle CORS for external images
    img.src = "https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/lr-web/NATCONID.jpg"; // Load the background image from the provided URL

    // Create and update QR code with the specific URL
    const qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      type: "canvas",
      data: url, // Use the URL passed as an argument
      image: "", // Optional: Path to a logo or image
      dotsOptions: {
        color: "#6e5410", // Foreground color (color of the QR code)
        type: "dots", // Dot style (e.g., 'dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded')
      },
      backgroundOptions: {
        color: "transparent", // Transparent background color
      },
      cornersSquareOptions: {
        type: "dot", // Customize corner square style (e.g., 'dot', 'square', 'extra-rounded')
        color: "#6e5410", // Color of the corner squares
      },
      cornersDotOptions: {
        type: "dot", // Customize corner dot style (e.g., 'dot', 'square')
        color: "#6e5410", // Color of the corner dots
      },
    });

    // Load the font using FontFace API
    const loadFont = async () => {
      const font = new FontFace(
        "MarketPro-Bold",
        "url(/fonts/MarketPro-Bold.woff2)"
      );
      await font.load();
      document.fonts.add(font);
      return font;
    };

    // Wait for the font and image to load before proceeding
    await Promise.all([
      new Promise((resolve) => {
        img.onload = resolve;
      }),
      loadFont(),
    ]);

    // Clear previous drawings
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Define margin and text fitting logic
    const margin = 60; // Margin from the edges of the canvas
    const maxWidth = canvas.width - 2 * margin; // Maximum width for the text

    // Function to calculate the maximum font size that fits the text within the canvas width
    const calculateMaxFontSize = (text, maxWidth) => {
      let fontSize = 120; // Start with a default large font size
      context.font = `bold ${fontSize}px MarketPro-Bold`;
      while (context.measureText(text).width > maxWidth && fontSize > 10) {
        // Minimum font size of 10
        fontSize -= 2; // Decrease font size
        context.font = `bold ${fontSize}px MarketPro-Bold`;
      }
      return fontSize;
    };

    // Calculate font sizes for first and last names
    const firstNameFontSize = calculateMaxFontSize(
      formattedFirstName,
      maxWidth
    );
    const lastNameFontSize = calculateMaxFontSize(formattedLastName, maxWidth);

    // Set font style, size, and color
    context.fillStyle = "black"; // Set text color to black
    context.textAlign = "center"; // Center text horizontally
    context.textBaseline = "middle"; // Middle of the text line will be aligned

    // Calculate positions for first and last names
    const centerX = canvas.width / 2; // Center of the canvas on the X-axis
    const firstNameY = 260; // Y position for the first name
    const lastNameY =
      firstNameY + Math.max(firstNameFontSize, lastNameFontSize) + 10; // Y position for the last name with some spacing

    // Draw the first name
    context.font = `bold ${firstNameFontSize}px MarketPro-Bold`;
    context.fillText(formattedFirstName, centerX, firstNameY);

    // Draw the last name
    context.font = `bold ${lastNameFontSize}px MarketPro-Bold`;
    context.fillText(formattedLastName, centerX, lastNameY);

    // Clear QR container and render the QR code
    qrContainerRef.current.innerHTML = ""; // Clear previous QR code
    qrCode.append(qrContainerRef.current);

    // Wait for QR code rendering
    await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust timing if necessary

    const qrImage = new Image();
    qrImage.src = qrContainerRef.current.querySelector("canvas").toDataURL(); // Convert QR code to data URL

    await new Promise((resolve) => {
      qrImage.onload = resolve;
    });

    // Calculate center position for the QR code on the X-axis
    const qrCodeWidth = 300; // Width of the QR code
    const qrCenterX = (canvas.width - qrCodeWidth) / 2; // Center X position

    // Draw the QR code on the main canvas, centered on the X-axis
    context.drawImage(qrImage, qrCenterX, 450, qrCodeWidth, 300); // Adjust position and size for smaller canvas

    // Create a link to download the image
    const imageURL = canvas.toDataURL();
    setImageList((prevList) => [...prevList, imageURL]);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `${formattedFirstName}_${formattedLastName}_Invitation.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="card flex flex-column justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div style={{ width: "80%" }}>
        {" "}
        {/* Parent div with set width */}
        <FloatLabel style={{ marginTop: "5%" }}>
          <InputTextarea
            id="description"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            cols={75}
          />
          <label htmlFor="description">
            Input the names to Generate Invitations (Format: Firstname,
            Lastname, URL)
          </label>
        </FloatLabel>
        {/* Button with onClick event */}
        <Button
          label="Generate"
          className="p-button-primary"
          onClick={handleGenerateClick}
          style={{ marginTop: "20px" }}
        />
        {/* Hidden canvas for drawing invitations */}
        <canvas
          ref={canvasRef}
          width={638}
          height={1013}
          style={{ display: "none" }}
        />
        {/* Hidden div to render QR code */}
        <div
          ref={qrContainerRef}
          style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        />
        {/* Display generated invitation images */}
        <div className="image-gallery" style={{ marginTop: "20px" }}>
          {imageList.map((image, index) => (
            <div key={index} className="image-item" style={{ margin: "10px" }}>
              <img
                src={image}
                alt={`Invitation ${index + 1}`}
                style={{ width: "300px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
