import { useTheme } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LoadingButton } from "@mui/lab";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState, useRef } from "react";
import AxiosInstance from "../config/AxiosInstance";
import Toast from "./Toast";
import { teams } from "../config/Data";
import Compressor from "compressorjs";
import bgAudioTrack from "../assets/audio/bg_audio_track.mp3";
import Divider from "@mui/material/Divider";

const attireColors = ["light", "primary", "dark", "yellow", "danger"];

const Registration = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  teams.sort((a, b) => a.localeCompare(b));
  const teamsSorted = teams;
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get("guest") === "true";

  const DEF_INPUTS = {
    registration_id: "Loading...",
    first_name: "",
    last_name: "",
    birthday: "",
    gender: "",
    photos: "",
    first_name_: "",
    last_name_: "",
    birthday_: "",
    gender_: "",
    photos_: "",
    email: "",
    phone: "",
    team: guest ? "Guest" : "",
    qr_name: "",
    qr_name_: "",
    guest_of: "",
    polo_shirt_size: "",
  };

  const [acceptedRegistration, setAcceptedRegistration] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmed, setConfirmation] = useState(false);
  const [fields, setFields] = useState(DEF_INPUTS);
  const [errors, setErrors] = useState(DEF_INPUTS);
  const [feedBack, setFeedBack] = useState({ message: "", severinty: "" });
  const [toastOpen, setToastOpen] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [session, setSession] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [photos_, setPhotos_] = useState([]);

  const audio = new Audio(bgAudioTrack);
  const currentYear = new Date().getFullYear();

  const playAudioTrack = () => {
    audio.play();
  };

  const handleChecked = (e) => {
    setConfirmation(e.target.checked);
  };

  const handleChangeField = (e) => {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  const clearError = (key) => {
    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const clearErrors = () => {
    Object.keys(errors).map((key) => {
      clearError(key);
    });
  };

  const setFieldValue = (key, value) => {
    setFields((prev) => ({
      ...prev,
      [key]: value,
    }));
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

  const handleSubmitForm = (event) => {
    event.preventDefault();

    if (!confirmed) {
      showToast("Please check the confirmation.", "error");
    } else {
      const formData = new FormData();

      fields.combined = localStorage.getItem("combined") === "1" ? "yes" : "no";
      formData.append("guest", guest);

      Object.keys(fields).forEach((key) => {
        if (key === "photos") {
          photos.forEach((p) => {
            formData.append("photos[]", p);
          });
        } else if (key === "photos_") {
          photos_.forEach((p) => {
            formData.append("photos_[]", p);
          });
        } else {
          formData.append(key, fields[key]);
        }
      });

      setLoadingSubmit(true);
      clearErrors();

      AxiosInstance.post(
        guest ? `submit-as-guest` : `confirmed-and-submitted-awardee`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .catch((e) => {
          const error = e.response.data.message === "Unauthenticated.";
          if (error) {
            showToast("User unauthorized.", "error");
          } else {
            const errMessage = e.response.data.message;
            const somethingWentWrong = errMessage === "Something went wrong.";
            const isGuest = e.response.data.guest;

            if (somethingWentWrong) {
              showToast(
                isGuest
                  ? "Invalid email address for guest of field."
                  : errMessage,
                isGuest ? "error" : "warning"
              );

              setLoadingSubmit(false);
            } else {
              const validation_errors = e.response.data.errors;

              Object.keys(validation_errors).map((key) => {
                setErrors((prev) => ({
                  ...prev,
                  [key]: validation_errors[key][0],
                }));
              });

              setLoadingSubmit(false);
            }
          }
        })
        .then((response) => {
          const data = response.data;
          showToast(data.message, "success");
          localStorage.setItem("session_user", false);
          setSession(false);
          setLoadingSubmit(false);
          playAudioTrack();
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const confirmDialog = () => {
    setLoadingConfirm(true);
    createAndCheckUserLatest();
  };

  const createAndCheckUserLatest = async () => {
    const auth_token = urlParams.get("auth_token");
    const data = JSON.stringify({ token: auth_token, guest: guest });

    authenticateUser();

    const response = await AxiosInstance.post(`create-reg-latest`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const result = response.data;

          localStorage.setItem("accessToken", result.token);
          localStorage.setItem("regId", result.reg_id);
          localStorage.setItem("combined", result.combined);

          setFieldValue("registration_id", result.reg_id);
          setFieldValue("email", result.user);

          setOpenDialog(false);
          setAcceptedRegistration(true);

          setLoadingConfirm(false);
        }
      })
      .catch((e) => {
        showToast("Session has been expired.", "warning");
        setLoadingConfirm(false);
      });
  };

  const authenticateUser = async () => {
    const response = await AxiosInstance.get("authenticate", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const awardee = response.data.awardee;
      const qrName = response.data.qr_name;
      const tmpName = response.data.invited.name;
      const tmpLast = response.data.invited.last;
      const combined = tmpName.includes(" & ");

      setFieldValue("registration_id", localStorage.getItem("regId"));
      setFieldValue("email", response.data.email);
      setAcceptedRegistration(true);

      if (localStorage.getItem("session_user")) {
        setSession(false);
      }

      if (awardee.length > 0) {
        setFieldValue("first_name", awardee[0].first_name);
        setFieldValue("last_name", awardee[0].last_name);
        setFieldValue(
          "qr_name",
          combined
            ? qrName.filter(
                (e) =>
                  e.split("/")[2] ===
                  `${tmpName.split(" & ")[0].replace(" ", "-")}-${tmpLast}.png`
              )
            : tmpName.replace(" ", "-")
        );

        if (awardee.length > 1) {
          setFieldValue("first_name_", awardee[1].first_name);
          setFieldValue("last_name_", awardee[1].last_name);
          setFieldValue(
            "qr_name_",
            qrName.filter(
              (e) =>
                e.split("/")[2] ===
                `${tmpName.split(" & ")[1].replace(" ", "-")}-${tmpLast}.png`
            )
          );
        }
      }
    }
  };

  const handleChangeUploadPhoto = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 3) {
      const filePromises = selectedFiles.map(
        (fileObj) =>
          new Promise((resolve) => {
            new Compressor(fileObj, {
              quality: 0.8,
              success: async (compressedResult) => {
                const base64 = await convertBase64(compressedResult);
                resolve(base64);
              },
            });
          })
      );

      const base64Files = await Promise.all(filePromises);

      console.log(base64Files);

      if (e.target.name === "photos") {
        setPhotos(base64Files);
      } else {
        setPhotos_(base64Files);
      }
    } else {
      if (e.target.name === "photos") {
        setErrors((prev) => ({
          ...prev,
          photos: "You can only select up to 3 photos.",
        }));

        return;
      }
      setErrors((prev) => ({
        ...prev,
        photos_: "You can only select up to 3 photos.",
      }));
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <Box>
      <Toast
        message={feedBack.message}
        severinty={feedBack.severinty}
        open={toastOpen}
        handleClose={handleCloseToast}
      />
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
            <Grid item>Confirmation</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please be advised that, this link/registration form will be used
            once with the email address you have provided.
            <br /> By confirming, your email address will be used automatically
            for initial registration within this device only.
            <br /> Our team will carefully review the data you've submitted to
            ensure all information is accurate and complete.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
          <LoadingButton
            onClick={confirmDialog}
            endIcon={<ExitToAppIcon />}
            loading={loadingConfirm}
            loadingPosition="end"
            color="warning"
          >
            <span>Confirm</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        <Card sx={{ maxWidth: "80vw", margin: lg ? 10 : 2 }}>
          <CardMedia
            component="img"
            alt={`NATON ${currentYear} Background`}
            height="auto"
            image={`https://leuteriorealty.com/images/natcon_rect_bg_2025.jpg`}
          />
          {session && (
            <Box>
              {acceptedRegistration && (
                <Box component="form" onSubmit={handleSubmitForm}>
                  <CardContent sx={{ margin: lg ? 3 : 1 }}>
                    <Box sx={{ marginBottom: 3 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ marginBottom: 2 }}
                      >
                        REGISTER TO NATCON {currentYear}
                      </Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        Registration ID:{" "}
                        <Typography variant="span" color="error">
                          {fields.registration_id}
                        </Typography>
                      </Typography> */}
                    </Box>
                    <Grid container spacing={5}>
                      <Grid item lg={3} xs={12} md={12}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            id="standard-basic"
                            label="First Name"
                            variant="standard"
                            color="warning"
                            name="first_name"
                            value={fields.first_name}
                            onChange={handleChangeField}
                          />
                          <FormHelperText error>
                            {errors.first_name}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            id="standard-basic"
                            label="Last Name"
                            variant="standard"
                            color="warning"
                            name="last_name"
                            value={fields.last_name}
                            onChange={handleChangeField}
                          />
                          <FormHelperText error>
                            {errors.last_name}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        {" "}
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            id="standard-basic"
                            label="birthday"
                            variant="standard"
                            type="date"
                            color="warning"
                            name="birthday"
                            value={fields.birthday}
                            onChange={handleChangeField}
                            focused
                          />
                          <FormHelperText error>
                            {errors.birthday}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        <FormControl variant="standard" fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Gender
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            color="warning"
                            name="gender"
                            value={fields.gender}
                            label="Gender"
                            onChange={handleChangeField}
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                          <FormHelperText error>{errors.gender}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        <FormControl fullWidth error>
                          <TextField
                            name="photos"
                            variant="outlined"
                            size="small"
                            type="file"
                            inputProps={{ multiple: true }}
                            onChange={handleChangeUploadPhoto}
                          />
                          <FormHelperText>{errors.photos}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={6} xs={12} md={12}>
                        <Typography variant="body2" color="text.secondary">
                          <Typography variant="span" color="danger.main">
                            PLEASE UPLOAD HD BUSINESS PHOTO/S (UP TO 3) <br />{" "}
                            FOR NATCON MATERIALS
                          </Typography>
                          <br />
                          <Typography variant="caption">
                            You can select multiple photos to be uploaded.
                          </Typography>
                        </Typography>
                      </Grid>
                    </Grid>
                    {localStorage.getItem("combined") === "1" && (
                      <Grid container spacing={5}>
                        <Grid item lg={3} xs={12} md={12}>
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              id="standard-basic"
                              label="First Name"
                              variant="standard"
                              color="warning"
                              name="first_name_"
                              value={fields.first_name_}
                              onChange={handleChangeField}
                            />
                            <FormHelperText error>
                              {errors.first_name_}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={3} xs={12} md={12}>
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              id="standard-basic"
                              label="Last Name"
                              variant="standard"
                              color="warning"
                              name="last_name_"
                              value={fields.last_name_}
                              onChange={handleChangeField}
                            />
                            <FormHelperText error>
                              {errors.last_name_}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={3} xs={12} md={12}>
                          {" "}
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              id="standard-basic"
                              label="birthday"
                              variant="standard"
                              type="date"
                              color="warning"
                              name="birthday_"
                              value={fields.birthday_}
                              onChange={handleChangeField}
                              focused
                            />
                            <FormHelperText error>
                              {errors.birthday_}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={3} xs={12} md={12}>
                          <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Gender
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              color="warning"
                              name="gender_"
                              value={fields.gender_}
                              label="Gender"
                              onChange={handleChangeField}
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                            </Select>
                            <FormHelperText error>
                              {errors.gender_}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={3} xs={12} md={12}>
                          <FormControl fullWidth error>
                            <TextField
                              name="photos_"
                              variant="outlined"
                              size="small"
                              type="file"
                              inputProps={{ multiple: true }}
                              onChange={handleChangeUploadPhoto}
                            />
                            <FormHelperText>{errors.photos_}</FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} xs={12} md={12}>
                          <Typography variant="body2" color="text.secondary">
                            <Typography variant="span" color="danger.main">
                              PLEASE UPLOAD HD BUSINESS PHOTO/S (UP TO 3) <br />{" "}
                              FOR NATCON MATERIALS
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              You can select multiple photos to be uploaded.
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    <Grid container spacing={5} sx={{ mt: 0 }}>
                      <Grid item lg={3} xs={12} md={12}>
                        {" "}
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            id="standard-basic"
                            label="Email"
                            variant="standard"
                            color="warning"
                            name="email"
                            value={fields.email}
                            onChange={handleChangeField}
                          />
                          <FormHelperText error>{errors.email}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        {" "}
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            id="standard-basic"
                            label="Phone"
                            variant="standard"
                            color="warning"
                            name="phone"
                            value={fields.phone}
                            onChange={handleChangeField}
                          />
                          <FormHelperText error>{errors.phone}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} xs={12} md={12}>
                        {guest ? (
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              id="standard-basic"
                              label="LR Email Address of Awardee"
                              variant="standard"
                              color="warning"
                              name="guest_of"
                              value={fields.guest_of}
                              onChange={handleChangeField}
                            />
                            <FormHelperText error>
                              {errors.guest_of}
                            </FormHelperText>
                          </FormControl>
                        ) : (
                          <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Select your Team
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={fields.team}
                              label="Gender"
                              name="team"
                              onChange={handleChangeField}
                              color="warning"
                            >
                              {teamsSorted.map((team, key) => {
                                return (
                                  <MenuItem value={team} key={key}>
                                    {team}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            <FormHelperText error>{errors.team}</FormHelperText>
                          </FormControl>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ margin: lg ? 3 : 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={confirmed}
                            onChange={(e) => handleChecked(e)}
                            color="warning"
                          />
                        }
                        label={`By checking this, you are confirming to attend the NATCON ${currentYear}`}
                      />
                    </FormGroup>
                  </CardActions>
                  <CardActions sx={{ margin: lg ? 3 : 1 }}>
                    <FormControl variant="standard">
                      <LoadingButton
                        endIcon={<ExitToAppIcon />}
                        loading={loadingSubmit}
                        type="submit"
                        loadingPosition="end"
                        color="warning"
                        variant="contained"
                        disableElevation
                      >
                        <span>Submit</span>
                      </LoadingButton>
                    </FormControl>
                  </CardActions>
                </Box>
              )}
              {!acceptedRegistration && (
                <Box>
                  <CardContent sx={{ margin: lg ? 3 : 1 }}>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ marginBottom: 1, fontWeight: "bold" }}
                    >
                      NATIONAL REAL ESTATE CONVENTION {currentYear}
                    </Typography>
                    <Typography variant="h6" sx={{ marginBottom: 3 }}>
                      Inviting the BEST of the BEST in Philippine Real Estate{" "}
                      {currentYear} into ONE GRAND NATIONAL CONVENTION
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ marginBottom: 1, fontWeight: "bold" }}
                    >
                      About NATCON {currentYear}
                    </Typography>
                    <Typography paragraph sx={{ marginBottom: 3 }}>
                      A 2-day grand gathering of Filipino Homes awardees from
                      Luzon, Visayas, and Mindanao <br /> to be held at{" "}
                      <b>Waterfront Hotel & Casino, Lahug, Cebu City.</b>
                      <br />
                      <br />
                      <b>DAY 1 - October 19, {currentYear}</b> (Sunday)
                      Conference and Welcome Party. Registration starts at{" "}
                      <b>10:30 A.M.</b> (Please take your early lunch). <br />
                      <b>ATTIRE:</b> FH Polo Shirt (To be provided)
                    </Typography>
                    <Typography paragraph>
                      <b>DAY 2 - October 20, {currentYear}</b> (Monday) National
                      Awards Night. The pictorial starts at <b>10:30 A.M.</b>
                      <br />
                      <b>ATTIRE (Strictly Formal):</b> <br />
                      WOMEN - Modern Gown
                      <br /> MEN - Modern Suit and Tie <br />
                      COLORS:
                    </Typography>
                    <Box display="flex" gap={1} mb={5}>
                      {attireColors.map((c) => (
                        <Box
                          height={30}
                          width={30}
                          bgcolor={`${c}.main`}
                          borderRadius={5}
                          border="1px solid #ccc"
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ marginBottom: 3 }}
                    >
                      Note: If you confim, this link will expire after 5 minutes
                      / after the registration process. <br /> PLEASE DO NOT
                      SHARE THIS LINK TO ANYONE.
                    </Typography>
                    <CardActions sx={{ marginLeft: -1 }}>
                      <FormControl variant="standard">
                        <Button
                          variant="contained"
                          endIcon={<OpenInNewIcon />}
                          color="warning"
                          onClick={handleOpenDialog}
                          disableElevation
                          // disabled={
                          //   localStorage.getItem("accessToken") !== null
                          // }
                        >
                          Proceed
                        </Button>
                      </FormControl>
                    </CardActions>
                  </CardContent>
                </Box>
              )}
            </Box>
          )}
          {!session && (
            <Box>
              <CardContent sx={{ margin: lg ? 3 : 1, textAlign: "center" }}>
                <CheckCircleIcon
                  sx={{ fontSize: 70, marginBottom: 3 }}
                  color="warning"
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ marginBottom: 1 }}
                >
                  Thank you for your registration. <br />
                </Typography>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ marginBottom: 1 }}
                >
                  Your registration details have been received, <br />
                  and our team will now review the provided information.
                </Typography>
                <Typography
                  gutterBottom
                  paragraph
                  component="div"
                  color="error"
                  sx={{ marginBottom: 1, fontWeight: "bold", marginTop: 4 }}
                >
                  We will send you an email attached with your QR Code within 48
                  hours after your registration. <br />
                  (This will serve as your ticket).
                  <br /> Kindly show your ticket at the registration booth
                  during the event.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  component="div"
                  sx={{ marginBottom: 1, textAlign: "center" }}
                >
                  Should you have any questions or require further assistance,{" "}
                  <br />
                  please do not hesitate to contact our registration support
                  team at (lrnatcon@gmail.com) or (+639173068269).
                </Typography>
              </CardContent>
            </Box>
          )}
        </Card>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: 5, textAlign: "center" }}
      >
        LR NATCON {currentYear} | &copy; All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Registration;
