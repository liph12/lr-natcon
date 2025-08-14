import 'primereact/resources/themes/saga-blue/theme.css';  // Import PrimeReact theme
import 'primereact/resources/primereact.min.css';          // Import PrimeReact core styles
import 'primeicons/primeicons.css';                        // Import PrimeIcons
import React, { useState, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';                // Import PrimeReact Button
import '../../public/fonts/stylesheet.css';                 // Your custom styles

export default function InvitationCard2() {
  const [value, setValue] = useState('');
  const [imageList, setImageList] = useState([]);
  const canvasRef = useRef(null);

  // Function to handle button click
  const handleGenerateClick = () => {
    // Split the input by new lines to get each name entry
    const names = value.split('\n');

    // Clear previous images
    setImageList([]);

    // Iterate over each name and create an invitation for it
    names.forEach((name) => {
      drawInvitation(name);
    });
  };

  // Function to draw the invitation
  const drawInvitation = (name) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let fullName = `${name}`.toUpperCase();
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS for external images
    img.src = 'https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/lr-web/invitation_new.jpg'; // Load the background image from the provided URL

    // Load the font using FontFace API
    const loadFont = async () => {
      const font = new FontFace('Ireene-Bold', 'url(/fonts/Ireene-Bold.woff2)');
      await font.load();
      document.fonts.add(font);
      return font;
    };

    img.onload = async () => {
      // Ensure font is loaded before drawing
      await loadFont();

      context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      context.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the background image

      let fontSize = 180; // Start with initial font size
      let x; // Declare x-coordinate outside loop to use it later

      // Adjust font size until x is greater than 500
      do {
        // Set font properties dynamically
        context.font = `bold ${fontSize}px Ireene-Bold`;
        context.textAlign = 'left'; // Set text alignment to 'left' to position based on starting x
        context.textBaseline = 'middle'; // Align text vertically to the middle

        // Calculate text width
        const textWidth = context.measureText(fullName).width;

        // Calculate the x-coordinate so that the end of the text aligns with 2300
        x = 2300 - textWidth;

        // Decrease font size if x is less than 500
        if (x < 200) {
          fontSize -= 5; // Adjust this value to control the decrement steps
        }
      } while (x < 200 && fontSize > 20); // Continue adjusting until x is greater than 500 or font size is reasonable

      // Set up text shadow properties
      context.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color with transparency
      context.shadowOffsetX = 10; // Horizontal shadow offset
      context.shadowOffsetY = 10; // Vertical shadow offset
      context.shadowBlur = 20; // Shadow blur

      // Apply the fill style
      context.fillStyle = '#e7bc24';

      // Draw the text with shadow
      context.fillText(fullName, x, 600);

      // Create a link to download the image
      const imageURL = canvas.toDataURL();
      // setImageList(prevList => [...prevList, imageURL]); // Add the new image to the list

      // Create a link to download the image
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `${fullName}_Invitation.png`;
      document.body.appendChild(link); // Append the link to the document body
      link.click(); // Trigger the click event
      document.body.removeChild(link); // Remove the link after downloading
    };
  };

  return (
    <div className="card flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
      <div style={{ width: '80%' }}> {/* Parent div with set width */}

        <FloatLabel style={{ marginTop: '5%' }}>
          <InputTextarea
            id="description"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            cols={75}
          />
          <label htmlFor="description">Input the names to Generate Invitations</label>
        </FloatLabel>

        {/* Button with onClick event */}
        <Button
          label="Generate"
          className="p-button-primary"
          onClick={handleGenerateClick}
          style={{ marginTop: '20px' }}
        />

        {/* Hidden canvas for drawing invitations */}
        <canvas ref={canvasRef} width={2480} height={2404} style={{ display: 'none' }} />
        {/* Display generated invitation images */}
        <div className="image-gallery" style={{ marginTop: '20px' }}>
          {imageList.map((image, index) => (
            <div key={index} className="image-item" style={{ margin: '10px' }}>
              <img src={image} alt={`Invitation ${index + 1}`} style={{ width: '600px', height: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
