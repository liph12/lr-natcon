import { useTheme } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LoadingButton } from "@mui/lab";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import AxiosInstance from "../config/AxiosInstance";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Compressor from "compressorjs";
import LinearProgress from "@mui/material/LinearProgress";
import QRCode from "react-qr-code";
import Toast from "./Toast";
import QRBorder from "./QRBorder";

const ViewAwardees = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [awardeeSelected, setAwardeeSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedBack, setFeedBack] = useState({ message: "", severinty: "" });
  const [toastOpen, setToastOpen] = useState(false);
  const [seatNumber, setSeatNumber] = useState(null);
  const [onProgress, setOnProgres] = useState(false);
  const [canvasQRBorder, setCanvasQRBorder] = useState(null);
  const [onProgressPreview, setOnProgressPreview] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = async (key) => {
    setOnProgressPreview(true);
    setOpenDialog(true);
    setAwardeeSelected(null);

    try {
      const index = rows.findIndex((r) => r.id === key);
      const { id } = rows[index];
      const response = await AxiosInstance.get(`get-awardee/${id}`);
      const { awardee } = response.data;
      const updatedAwardee = formatAwardee(awardee);

      if (response.status === 200) {
        setAwardeeSelected(updatedAwardee);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOnProgressPreview(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "First Name", width: 250 },
    { field: "lastName", headerName: "Last Name", width: 180 },
    { field: "email", headerName: "Email", width: 250 },
    // { field: "phone", headerName: "Phone Number", width: 180 },
    { field: "team", headerName: "Team", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params.row.approved ? (
              <IconButton
                color="success"
                aria-label="approved"
                onClick={() => handleOpenDialog(params.row.id)}
              >
                <CheckCircleIcon />
              </IconButton>
            ) : (
              <IconButton
                color="warning"
                aria-label="approve"
                onClick={() => handleOpenDialog(params.row.id)}
                disabled={params.row.approved}
              >
                <OpenInNewIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const approveDialog = () => {
    updateApprovedAwardeeStatus();
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const showToast = (m, s) => {
    setToastOpen(true);
    setFeedBack({
      message: m,
      severinty: s,
    });
  };

  const updateApprovedAwardeeStatus = async () => {
    setLoadingApprove(true);
    const { regId, id, firstName, email, lastName, qrValue } = awardeeSelected;
    const imageURL = canvasQRBorder.toDataURL("image/jpeg", 0.8);

    const param = {
      id: id,
      ticket_id: qrValue,
      name: firstName,
      email: email,
      canvas_image: imageURL,
    };
    const data = JSON.stringify(param);
    const response = await AxiosInstance.post(`approve-awardee`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      const updatedAwardee = formatAwardee(data);

      showToast("Confirmation sent successfully!", "success");
      setLoadingApprove(false);
      setAwardeeSelected(updatedAwardee);
      fetchAwardees();
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleChangeUploadPhoto = async (e) => {
    const fileObj = e.target.files[0];
    const url = URL.createObjectURL(fileObj);

    setUploadingImage(true);
    setImagePreview(url);

    new Compressor(fileObj, {
      quality: 0.8,
      success: async (compressedResult) => {
        const base64 = await convertBase64(compressedResult);

        const param = {
          id: awardeeSelected.id,
          photo: base64,
        };
        const data = JSON.stringify(param);

        const response = await AxiosInstance.post(
          `update-image-awardee`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          const updatedAwardee = formatAwardee(data);

          showToast("Image updated successfully!", "success");
          setUploadingImage(false);
          setAwardeeSelected(updatedAwardee);
          fetchAwardees();
        }
      },
    });
  };

  const updateSeatNumber = async () => {
    setOnProgressPreview(true);

    const params = {
      id: awardeeSelected.id,
      seat_number:
        seatNumber === null ? awardeeSelected.seatNumber : seatNumber,
    };

    const data = JSON.stringify(params);
    const response = await AxiosInstance.post(`update-seat-number`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      const updatedAwardee = formatAwardee(data);

      showToast("Seat number updated successfully!", "success");
      setAwardeeSelected(updatedAwardee);
      setOnProgressPreview(false);
      fetchAwardees();
    }
  };

  const handleChangeSeatNumber = (e) => {
    setSeatNumber(e.target.value);
  };

  const formatAwardee = (data) => {
    const photo = `https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/${data.photo}`;

    return {
      id: data.id,
      firstName: data.firstName.toUpperCase(),
      lastName: data.lastName.toUpperCase(),
      email: data.email,
      phone: data.phone,
      team: data.team,
      regId: data.regId,
      photo: photo,
      qrCode: data.qrCode,
      approved: data.approved,
      qrValue: `${data.firstName.replace(" ", "-")}|${data.regId}|${data.id}`,
      seatNumber: data.seatNumber,
      owner: data.owner,
      poloShirtSize: data.poloShirtSize,
    };
  };

  const fetchAwardees = async () => {
    setOnProgres(true);
    const response = await AxiosInstance.get(`get-awardees`);

    if (response.status === 200) {
      const data = response.data;

      const newQualifiers = data.map((el) => formatAwardee(el));

      setRows(newQualifiers);
      setOnProgres(false);
    }
  };

  const saveCanvasAsImage = () => {
    const link = document.createElement("a");
    link.href = canvasQRBorder.toDataURL("image/png");
    link.download = "qr-with-border.png";
    link.click();
  };

  useEffect(() => {
    if (canvasQRBorder === null) {
      fetchAwardees();
    }
  }, []);

  return (
    <Box>
      <Toast
        message={feedBack.message}
        severinty={feedBack.severinty}
        open={toastOpen}
        handleClose={handleCloseToast}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {onProgressPreview && <LinearProgress color="warning" />}
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item>
              <InfoOutlinedIcon sx={{ mt: 0.5, mr: 1 }} />
            </Grid>
            <Grid item>Information on Review</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {awardeeSelected ? (
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
              <Box sx={{ marginY: 5 }}>
                {uploadingImage ? (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress color="warning" />
                  </Box>
                ) : (
                  <FormControl fullWidth error>
                    <TextField
                      name="photo"
                      variant="outlined"
                      size="small"
                      type="file"
                      onChange={handleChangeUploadPhoto}
                    />
                  </FormControl>
                )}
              </Box>
              <Typography component="div" variant="h5" sx={{ mb: 1 }}>
                {awardeeSelected.firstName} {awardeeSelected.lastName}
              </Typography>
              <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                Email: {awardeeSelected.email}
              </Typography>
              <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                Phone: {awardeeSelected.phone}
              </Typography>
              {awardeeSelected.team === "Guest" ? (
                <>
                  <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                    Guest of:{" "}
                    {awardeeSelected.owner?.includes(" --- ")
                      ? awardeeSelected.owner?.replace(" --- ", " AND ")
                      : awardeeSelected.owner}
                  </Typography>
                  <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                    Polo shirt size: {awardeeSelected?.poloShirtSize}
                  </Typography>
                </>
              ) : (
                <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                  Team: {awardeeSelected.team}
                </Typography>
              )}
              <Box
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  marginBottom: 3,
                  mt: 5,
                }}
              >
                {awardeeSelected.qrCode === null ||
                awardeeSelected.qrCode === "" ? (
                  <></>
                ) : (
                  <Avatar
                    alt={awardeeSelected.firstName}
                    src={`https://filipinohomes123.s3.amazonaws.com/${awardeeSelected.qrCode}`}
                    sx={{ width: "auto", height: 280 }}
                    variant="square"
                  />
                )}
                <QRCode
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                    display: "none",
                  }}
                  value={`${awardeeSelected.firstName}|${awardeeSelected.regId}|${awardeeSelected.id}`}
                  viewBox={`0 0 256 256`}
                />
              </Box>
              <Grid container>
                <Grid item>
                  <FormControl variant="standard" fullWidth>
                    <TextField
                      id="standard-basic"
                      label="Seat Number"
                      variant="filled"
                      color="warning"
                      name="last_name"
                      size="small"
                      autoComplete="off"
                      onChange={handleChangeSeatNumber}
                      value={
                        seatNumber === null
                          ? awardeeSelected.seatNumber
                          : seatNumber
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    size="medium"
                    color="warning"
                    sx={{ m: 1 }}
                    loading={onProgressPreview}
                    onClick={updateSeatNumber}
                  >
                    Update
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              <Typography
                component="div"
                variant="h5"
                sx={{ textAlign: "center" }}
              >
                Loading...
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
          {awardeeSelected && (
            <LoadingButton
              onClick={approveDialog}
              endIcon={<HowToRegIcon />}
              loading={loadingApprove}
              disabled={awardeeSelected.approved}
              loadingPosition="end"
              color="warning"
            >
              <span>Send Confirmation</span>
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
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
                OFFICIAL LIST OF AWARDEES
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={5}>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1" color="gray">
                      APPROVED:
                    </Typography>
                  </Grid>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1">
                      <b>
                        {rows.filter((obj) => obj.approved === true).length}
                      </b>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1" color="gray">
                      OVERALL:
                    </Typography>
                  </Grid>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1">
                      <b>{rows.length}</b>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1" color="gray">
                      ESTIMATED:
                    </Typography>
                  </Grid>
                  <Grid item lg={1} md={2} xs={4}>
                    <Typography component="div" variant="body1">
                      <b>455</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <DataGrid
                  loading={onProgress}
                  rows={rows}
                  sx={{ borderRadius: 0, height: "100vh" }}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[10, 15, 20]}
                  slots={{ toolbar: GridToolbar }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {awardeeSelected !== null && (
        <QRBorder
          awardee={awardeeSelected}
          setCanvasQRBorder={setCanvasQRBorder}
        />
      )}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: 5, textAlign: "center" }}
      >
        LR NATCON 2024 | &copy; All Rights Reserved
      </Typography>
    </Box>
  );
};

export default ViewAwardees;
