import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import Button from "@mui/material/Button";
import AxiosInstance from "../config/AxiosInstance";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { QrReader } from "react-qr-reader";

const QRScanner = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const [openDialog, setOpenDialog] = useState(false);
  const [awardeeSelected, setAwardeeSelected] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (data) => {
    setOpenDialog(true);

    setAwardeeSelected(data);
  };

  const processQRResult = async (res) => {
    if (res) {
      const result = res.text.split("|");
      const index = result[result.length - 1];

      const response = await AxiosInstance.get(`get-awardee/${index}`);

      if (response.data.success) {
        const data = response.data.awardee;

        // https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/natcon-invitation/photos/YSRK1695266596.png
        // http://localhost:8000/photos/YSRK1695266596.png

        let tmpPhoto = data.photo.replace(
          "https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/natcon-invitation/",
          "http://localhost:8000/"
        );

        data.photo = tmpPhoto;
        handleOpenDialog(response.data.awardee);
      }
    }
  };

  return (
    <Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item>
              <InfoOutlinedIcon sx={{ mt: 0.5, mr: 1 }} />
            </Grid>
            <Grid item>Information on Review</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {awardeeSelected && (
            <Box>
              <Box
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  marginBottom: 3,
                }}
              >
                <Avatar
                  alt={awardeeSelected.firstName}
                  src={awardeeSelected.photo}
                  sx={{ width: "auto", height: 280 }}
                  variant="rounded"
                />
              </Box>
              <Typography component="div" variant="h5" sx={{ marginBottom: 2 }}>
                {awardeeSelected.firstName} {awardeeSelected.lastName}
              </Typography>
              <Typography component="div" paragraph>
                Email: {awardeeSelected.email}
              </Typography>
              <Typography component="div" paragraph>
                Phone: {awardeeSelected.phone}
              </Typography>
              {awardeeSelected.team === "Guest" ? (
                <Typography component="div" paragraph>
                  Guest of: {awardeeSelected.owner}
                </Typography>
              ) : (
                <Typography component="div" paragraph>
                  Team: {awardeeSelected.team}
                </Typography>
              )}
              <Typography component="div" paragraph>
                Table Number: {awardeeSelected.seatNumber}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ maxWidth: "auto", margin: lg ? 5 : 2 }}>
          <CardMedia
            component="img"
            alt="NATON 2024 Background"
            height="auto"
            image={NATCONBackGround}
          />
          <CardContent sx={{ margin: lg ? 3 : 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ marginBottom: 3, textAlign: "center" }}
            >
              Scan Awardee
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <QrReader
                containerStyle={{
                  height: 500,
                  width: 600,
                }}
                constraints={{
                  facingMode: "environment",
                }}
                onResult={(result, error) => {
                  if (result) {
                    processQRResult(result);
                  }

                  if (error) {
                    console.info(error);
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default QRScanner;
