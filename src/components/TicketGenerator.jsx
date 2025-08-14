import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCodeStyling from "qr-code-styling"; // Import QRCodeStyling library

const TicketGenerator = () => {
  const [ticketContent, setTicketContent] = useState("");
  const [lastNumberInput, setLastNumberInput] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [rows, setRows] = useState([]); // State for storing table rows
  const [id, setId] = useState(1); // To generate unique ids for each row
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const loadFonts = async () => {
      const fonts = [
        new FontFace("Krungthep", "url(/fonts/TicketFonts/Krungthep.woff2)"),
        new FontFace("Mordova", "url(/fonts/TicketFonts/MordovaRegular.woff2)"),
        new FontFace("LS Harsey Sans One", "url(/fonts/TicketFonts/LSHarseySans-One.woff2)"),
        new FontFace("Ireene", "url(/fonts/TicketFonts/Ireene-Bold.woff2)")
      ];

      await Promise.all(fonts.map((font) => font.load()));
      fonts.forEach((font) => document.fonts.add(font));
    };

    loadFonts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ticketContent.trim() && lastNumberInput.trim() && tableNo.trim()) {
      const lines = ticketContent.split("\n").filter((line) => line.trim() !== "");  // split by new line for multiple names
      let number = parseInt(lastNumberInput, 10);

      lines.forEach((line, index) => {
        const fullName = line.split(",").map((name) => name.trim()).join(" ");

        // Store rows for table display or other usage
        setRows((prevRows) => [
          ...prevRows,
          {
            id: id + index,
            name: fullName,
            number: number + index,
            tableNo: tableNo,
          }
        ]);

        setId(id + lines.length);

        // Call drawTicket for each name
        drawTicket(number + index, tableNo, line);  // draw each name on its own canvas
      });

      // Clear the input fields after submission
      setTicketContent("");
      setLastNumberInput("");
      setTableNo("");
    } else {
      alert("Please fill in all fields.");
    }
  };

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
  const drawTicket = (number, tableNo, name) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Split the name by spaces or commas and create the nameParts array
    const nameParts = name.split(/[\s,]+/); // Split by spaces or commas

    // Destructure the nameParts array, providing defaults for secondname, thirdname, and fourthname
    const [firstname, secondname = "", thirdname = "", fourthname = ""] = nameParts;

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
    return names.filter(name => typeof name === 'string' && name.trim().length > 0);
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

    context.font = `bold 35px 'Ireene-Bold'`;
    context.fillStyle = "#f1ebd0";
    context.fillText(`#${formattedNumber}`, 130, 600);

    context.fillStyle = "#c29028";
    context.fillText(`#${formattedNumber}`, 1520, 595);

    context.fillStyle = "#000";
    context.fillText(`#${formattedNumber}`, 1785, 595);

    context.font = `bold 45px 'Ireene-Bold'`;
    context.fillStyle = "#f1ebd0";
    context.textAlign = "left";  // Center the text based on the x coordinate
    context.fillText(`${tableNo}`, 580, 527);  // Text will be centered around x=600

  };

  // Function to generate the QR code and draw it on the canvas
  const generateQRCode = (name, canvas, context) => {
    const qrCode = new QRCodeStyling({
      width: 150,
      height: 150,
      data: `${name}-pb`,
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

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "Tickets.xlsx");
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Tickets", 20, 10);
    doc.autoTable({
      head: [["ID", "Name", "Number", "Table No"]],
      body: rows.map((row) => [row.id, row.name, row.number, row.tableNo]),
    });
    doc.save("Tickets.pdf");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "number", headerName: "Number", width: 150, type: "number" },
    { field: "tableNo", headerName: "Table No", width: 150, type: "number" },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          Ticket Generator
        </Typography>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Number Input"
                type="number"
                variant="outlined"
                fullWidth
                value={lastNumberInput}
                onChange={(e) => setLastNumberInput(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Table No"
                type="text" // Changed from "number" to "text"
                variant="outlined"
                fullWidth
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enter Ticket Content"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={ticketContent}
                onChange={(e) => setTicketContent(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Generate Ticket
          </Button>
        </form>

        {/* DataGrid Section */}
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>

        {/* Export Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={exportToExcel}>
            Export to Excel
          </Button>
          <Button variant="outlined" onClick={exportToPDF}>
            Export to PDF
          </Button>
        </Box>

        {/* Canvas for drawing tickets */}
        <canvas
          ref={canvasRef}
          width={1921}
          height={638}
          style={{ display: "block", margin: "20px 0" }}
        />
      </Box>
    </Container>
  );
};

export default TicketGenerator;
