// Updated the layout and styling of InvitationNew.jsx to match Invitation.jsx.
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import data from "../data/data.json";
import { Button } from "@mui/material";
import "../../public/fonts/stylesheet.css";
import invitationImg from "../assets/images/natcon_2025.png";
import invitationTeamImg from "../assets/images/natcon_2025.png";

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

const InvitationNew = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(() => {
    const saved = localStorage.getItem("selectedRows");
    return saved ? JSON.parse(saved) : [];
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    // Load data from the JSON file and add unique IDs
    const updatedData = data.map((row, index) => ({ id: index + 1, ...row }));
    setRows(updatedData);
  }, []);

  const drawInvitation = (firstName, lastName, fullName, subtitle) => {
    if (!fullName) {
      console.error("Full name is invalid or empty.");
      return;
    }

    console.log("Drawing invitation for:", fullName); // Debugging log
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
      const subtitleText = subtitle || "VIP | TOP AGENT";
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

      // Download the canvas as an image
      const downloadCanvas = () => {
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
        const link = document.createElement("a");
        link.download = `${lastName} ${firstName} Invitation.jpg`;
        link.href = dataURL;
        link.click();
      };

      downloadCanvas();
    };
  };

  const handleGenerate = (row) => {
    const lastName = row["LAST NAME"].toUpperCase();
    const firstName = row["FIRST NAME"].toUpperCase();
    const fullName = `${firstName} ${lastName}`;
    const subtitle = row["Subtitle"];
    drawInvitation(firstName, lastName, fullName, subtitle);
  };

  const handleGenerateAll = async () => {
    for (const row of rows) {
      const lastName = row["LAST NAME"].toUpperCase();
      const firstName = row["FIRST NAME"].toUpperCase();
      const fullName = `${firstName} ${lastName}`;
      const subtitle = row["Subtitle"];
      drawInvitation(firstName, lastName, fullName, subtitle);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
    }
  };

  const handleRowClick = (row) => {
    const isSelected = selectedRows.some((r) => r.id === row.id);
    let updatedSelection;

    if (isSelected) {
      updatedSelection = selectedRows.filter((r) => r.id !== row.id);
    } else {
      updatedSelection = [...selectedRows, row];
    }

    setSelectedRows(updatedSelection);
    localStorage.setItem("selectedRows", JSON.stringify(updatedSelection));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "INVITATION", headerName: "Full Name", width: 250 },
    { field: "FIRST NAME", headerName: "First Name", width: 250 },
    { field: "LAST NAME", headerName: "Last Name", width: 200 },
    { field: "EMAIL", headerName: "Email", width: 200 },
    { field: "TEAM", headerName: "Team", width: 150 },
    { field: "Subtitle", headerName: "SUBTITLE", width: 150 },
    { field: "REMARKS", headerName: "REMARKS", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleGenerate(params.row)}
        >
          Generate
        </Button>
      ),
    },
    {
      field: "checkmark",
      headerName: "Selected",
      width: 100,
      renderCell: (params) =>
        selectedRows.some((r) => r.id === params.row.id) ? "✔" : "",
    },
  ];

  const handleRowSelection = (params) => {
    handleRowClick(params.row);
  };

  return (
    <>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <Card sx={{ width: "80vw", margin: lg ? 10 : 5 }}>
          <CardMedia
            component="img"
            alt="NATON 2024 Background"
            height="auto"
            image={NATCONBackGround}
          />
          <CardContent sx={{ margin: lg ? 3 : 1 }}>
            <Box
              sx={{
                marginBottom: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ marginBottom: 3 }}
              >
                LIST OF QUALIFIERS FOR INVITATION
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateAll}
              >
                Generate All
              </Button>
            </Box>
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                sx={{ borderRadius: 0, height: "92vh" }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 15, 20, 50, 100, 200, 300, 400]}
                slots={{ toolbar: GridToolbar }}
                onRowClick={handleRowClick}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <canvas
        ref={canvasRef}
        width={2480}
        height={2404}
        style={{ display: "none" }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: 5, textAlign: "center" }}
      >
        LR NATCON 2024 | &copy; All Rights Reserved
      </Typography>
    </>
  );
};

export default InvitationNew;
