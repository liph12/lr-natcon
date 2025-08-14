import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import AxiosInstance from "../config/AxiosInstance";
import Pusher from "pusher-js";

const QRScanner = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ maxWidth: "80vw", margin: lg ? 10 : 5 }}>
          <CardMedia
            component="img"
            alt="NATON 2024 Background"
            height="auto"
            image={NATCONBackGround}
          />
          <CardContent sx={{ margin: lg ? 3 : 1 }}>
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ marginBottom: 2 }}
              >
                Scan QR for Awardee
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default QRScanner;
