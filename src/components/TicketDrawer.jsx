import React, { useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling"; // Import QRCodeStyling library

const TicketDrawer = () => {
    const canvasRef = useRef(null);
    const qrCodeRef = useRef(null);

    // Updated downloadCanvas function
    const downloadCanvas = (canvas, name) => {
        const dataURL = canvas.toDataURL("image/png");  // Convert canvas to image

        // Create a temporary link element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = `${name} Ticket.png`;  // The name for the downloaded file

        // Trigger the download by programmatically clicking the link
        downloadLink.click();
    };

    // Updated drawTicket function to pass the canvas and context
    const drawTicket = (number, tableNo, firstname, secondname, thirdname, fourthname) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Clear previous drawings
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Load and draw the background image from the public folder
        const img = new Image();
        img.crossOrigin = "anonymous"; // Set the crossOrigin attribute to prevent tainting

        img.src = `/ticket.png`; // Use image from the public folder
        img.onload = () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Process and draw the names
            const names = processNames(firstname, secondname, thirdname, fourthname);
            drawStraightNames(names, context);  // Existing function

            const rotatedNames = processNames(firstname, secondname, thirdname + ' ' + fourthname);
            drawRotatedNames(rotatedNames, context);  // New function for rotated names 
            drawRotatedGoldNames(rotatedNames, context);  // New function for rotated names

            // Draw ticket and table numbers
            drawTicketNumber(context, number, tableNo);

            // Generate and draw the QR code on the canvas
            generateQRCode(`${firstname} ${secondname} ${thirdname} ${fourthname}`, canvas, context);
        };
    };

    // Helper function to handle name processing
    const processNames = (...names) => {
        return names.filter(name => name && name.trim().length > 0);
    };

    // Function to draw straight names (existing)
    const drawStraightNames = (names, context) => {
        const minX = 20, maxX = 240, minY = 360, maxY = 560, boxHeight = maxY - minY;
        let lineHeight = 60;
        let totalTextHeight = lineHeight * names.length;

        if (totalTextHeight > boxHeight) {
            lineHeight = boxHeight / names.length;
            totalTextHeight = lineHeight * names.length;
        }

        let yPosition = minY + (boxHeight - totalTextHeight) / 2 + lineHeight / 2;

        names.forEach(name => {
            drawTextWithFontSize(context, name.toUpperCase(), (minX + maxX) / 2, yPosition, 150, 75, 'c29028');
            yPosition += lineHeight;
        });
    };

    // Function to draw rotated names (new)
    const drawRotatedNames = (names, context) => {
        const canvas = canvasRef.current;
        const areaHeight = 638; // Height of the right area for the rotated text
        const areaWidth = 150; // Limited width of the right area
        const margin = 50; // Margin from the right side of the canvas

        // Position the text box on the right side of the canvas
        const rightEdgeX = canvas.width - margin;
        const rightEdgeY = (canvas.height - areaHeight) / 2; // Center the box vertically within the canvas

        // Save the original context state
        context.save();

        // Translate and rotate the context to write the name vertically
        context.translate(rightEdgeX, rightEdgeY + areaHeight / 2); // Translate to the right area and center vertically
        context.rotate(Math.PI / 2); // Rotate 90 degrees clockwise

        // Define the line height and calculate total text height
        let lineHeight = 50;
        let totalTextHeight = lineHeight * names.length;

        // Adjust line height if the total text height exceeds the available area height
        if (totalTextHeight > areaHeight) {
            lineHeight = areaHeight / names.length;
            totalTextHeight = lineHeight * names.length;
        }

        // Calculate the starting yPosition to vertically center the text block
        let yPosition = -(totalTextHeight / 2) + 120;

        // Function to adjust font size based on text width and box width
        const adjustFontSize = (text, maxFontSize, maxHeight, maxWidth) => {
            let fontSize = maxFontSize;
            let textWidth;
            let textHeight;

            do {
                context.font = `bold ${fontSize}px 'LS Harsey Sans One'`;
                textWidth = context.measureText(text).width;
                textHeight = context.measureText(text).height;

                if (textWidth > maxWidth) {
                    fontSize -= 2; // Decrease font size if it exceeds the width textHeight > maxHeight || 
                } else {
                    break; // Stop if it fits within the width
                }
            } while (fontSize > 10); // Prevent font size from getting too small

            return fontSize;
        };

        // Draw each name, adjusting the Y position per line
        names.forEach(name => {
            const fontSize = adjustFontSize(name, 60, 638, 300); // Adjust font size to fit the box width
            context.font = `bold ${fontSize}px 'Ireene-Bold'`;
            context.fillStyle = '#000000';
            context.textAlign = "center";
            context.fillText(capitalizeEachWord(name), 0, yPosition); // Draw text at the current position
            yPosition += lineHeight;
        });

        // Restore the context to its original state
        context.restore();
    };
    const drawRotatedGoldNames = (names, context) => {
        const canvas = canvasRef.current;
        const areaHeight = 638; // Height of the right area for the rotated text
        const areaWidth = 150; // Limited width of the right area
        const margin = 50; // Margin from the right side of the canvas

        // Position the text box on the right side of the canvas
        const rightEdgeX = canvas.width - margin;
        const rightEdgeY = (canvas.height - areaHeight) / 2; // Center the box vertically within the canvas

        // Save the original context state
        context.save();

        // Translate and rotate the context to write the name vertically
        context.translate(rightEdgeX, rightEdgeY + areaHeight / 2); // Translate to the right area and center vertically
        context.rotate(Math.PI / 2); // Rotate 90 degrees clockwise

        // Define the line height and calculate total text height
        let lineHeight = 50;
        let totalTextHeight = lineHeight * names.length;

        // Adjust line height if the total text height exceeds the available area height
        if (totalTextHeight > areaHeight) {
            lineHeight = areaHeight / names.length;
            totalTextHeight = lineHeight * names.length;
        }

        // Calculate the starting yPosition to vertically center the text block
        let yPosition = -(totalTextHeight / 2) + 375;

        // Function to adjust font size based on text width and box width
        const adjustFontSize = (text, maxFontSize, maxHeight, maxWidth) => {
            let fontSize = maxFontSize;
            let textWidth;
            let textHeight;

            do {
                context.font = `bold ${fontSize}px 'LS Harsey Sans One'`;
                textWidth = context.measureText(text).width;
                textHeight = context.measureText(text).height;

                if (textWidth > maxWidth) {
                    fontSize -= 2; // Decrease font size if it exceeds the width textHeight > maxHeight || 
                } else {
                    break; // Stop if it fits within the width
                }
            } while (fontSize > 10); // Prevent font size from getting too small

            return fontSize;
        };

        // Draw each name, adjusting the Y position per line
        names.forEach(name => {
            const fontSize = adjustFontSize(name, 60, 638, 300); // Adjust font size to fit the box width
            context.font = `bold ${fontSize}px 'Ireene-Bold'`;
            context.fillStyle = '#c29028';
            context.textAlign = "center";
            context.fillText(capitalizeEachWord(name), 0, yPosition); // Draw text at the current position
            yPosition += lineHeight;
        });

        // Restore the context to its original state
        context.restore();
    };

    // Function to capitalize the first letter of each word
    const capitalizeEachWord = (name) => {
        return name
            .toLowerCase() // Convert the entire string to lowercase
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and make sure the rest is lowercase
            .join(' '); // Join the words back into a single string
    };

    // Function to draw text with adjusted font size (existing)
    const drawTextWithFontSize = (context, text, x, y, maxWidth, maxHeight, color) => {
        let fontSize = 60;
        let textWidth, textHeight;

        context.textAlign = "center";

        do {
            context.font = `bold ${fontSize}px 'LS Harsey Sans One'`;
            context.fillStyle = `#${color}`;
            textWidth = context.measureText(text).width;
            textHeight = fontSize * 1.2;

            if (textHeight > maxHeight) {
                fontSize -= 5;
            } else {
                break;
            }
        } while (fontSize > 10);

        context.font = `bold ${fontSize}px 'LS Harsey Sans One'`;
        context.fillText(text, x, y);
    };

    // Function to draw ticket and table numbers (existing)
    const drawTicketNumber = (context, number, tableNo) => {
        // Ensure the number is always formatted to three digits
        const formattedNumber = number.toString().padStart(3, '0');
        const formattedTableNumber = tableNo.toString().padStart(2, '0'); // Keeping tableNo two digits

        context.font = `bold 35px 'Ireene-Bold'`;
        context.fillStyle = "#f1ebd0";
        context.fillText(`#${formattedNumber}`, 130, 600);

        context.fillStyle = "#c29028";
        context.fillText(`#${formattedNumber}`, 1520, 595);

        context.fillStyle = "#000";
        context.fillText(`#${formattedNumber}`, 1785, 595);

        context.font = `bold 45px 'Ireene-Bold'`;
        context.fillStyle = "#f1ebd0";
        context.fillText(`${formattedTableNumber}`, 600, 527);
    };

    // Function to generate the QR code and draw it on the canvas
    const generateQRCode = (name, canvas, context) => {
        const qrCode = new QRCodeStyling({
            width: 150,
            height: 150,
            data: name,
            image: "",
            dotsOptions: {
                gradient: {
                    type: "linear",
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: "#FFD700" },
                        { offset: 1, color: "#FFA500" },
                    ],
                },
                type: "dots",
            },
            backgroundOptions: {
                gradient: {
                    type: "linear",
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: "#192232" },
                        { offset: 1, color: "#0b152a" },
                    ],
                },
            },
            qrOptions: {
                errorCorrectionLevel: "Q",
            },
            cornersSquareOptions: {
                gradient: {
                    type: "linear",
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: "#FFD700" },
                        { offset: 1, color: "#FFA500" },
                    ],
                },
                type: "dot",
            },
            cornersDotOptions: {
                gradient: {
                    type: "linear",
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: "#FFD700" },
                        { offset: 1, color: "#FFA500" },
                    ],
                },
                type: "dot",
            },
        });

        qrCode.getRawData("jpeg").then((qrImage) => {
            const qrImg = new Image();
            qrImg.src = URL.createObjectURL(qrImage);

            qrImg.onload = () => {
                // Draw QR code on the canvas at the desired position
                context.drawImage(qrImg, 55, 180, 150, 150);
                // Trigger download after QR code is drawn on the canvas
                downloadCanvas(canvas, name);
            };
        });
    };

    useEffect(() => {
        // drawTicket(1, 1, "Anthony", "Leuterio &", "Flora May", "Pesquira");
        // drawTicket(8, 2, "Bienvenida", "& Edwardo", "Badayos", "");
        // drawTicket(123, 8, "Princess", "Jamaimah", "Calumpong", "");
        drawTicket(200, 12, "Grace", "", "Ruiz", "Angeles");
        // drawTicket(219, 12, "Johnry", "Fibra", "", "");
        // drawTicket(333, 22, "Philip John", "Libres", "", "");
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={1921}
                height={638}
                style={{ display: "block", margin: "20px 0" }}
            />
            <div ref={qrCodeRef} style={{ display: "none" }}></div> {/* Hidden container for QR code */}
            <button id="downloadButton" style={{ display: "none" }} onClick="downloadCanvas()">Download Ticket</button>
        </div>
    );
};

export default TicketDrawer;
