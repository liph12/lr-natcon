import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import Button from "@mui/material/Button";
import AxiosInstance from "../config/AxiosInstance";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

const AwardeeImageUploader = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [awardeeSelected, setAwardeeSelected] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (data) => {
    setOpenDialog(true);

    setAwardeeSelected(data);
  };

  const viewAwardee = async (index) => {
    const response = await AxiosInstance.get(`get-awardee/${index}`);

    if (response.data.success) {
      handleOpenDialog(response.data.awardee);
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
              {awardeeSelected.team === "No team" ? (
                <Typography component="div" paragraph>
                  Guest of: {awardeeSelected.owner}
                </Typography>
              ) : (
                <Typography component="div" paragraph>
                  Team: {awardeeSelected.team}
                </Typography>
              )}
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
              Update Image Awardee
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AwardeeImageUploader;
