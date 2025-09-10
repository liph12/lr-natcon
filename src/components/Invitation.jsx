import { useTheme } from "@emotion/react";
import SendIcon from "@mui/icons-material/Send";
import ReplayIcon from "@mui/icons-material/Replay";
import { LoadingButton } from "@mui/lab";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NATCONBackGround from "../assets/images/natcon_rect_bg.jpg";
import AxiosInstance from "../config/AxiosInstance";
import InvitationNew from "./InvitationNew";
import data from "../data/data.json";

const Invitation = () => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const [rows, setRows] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState([]);
  const [onProgress, setOnProgres] = useState(false);
  const [awardee, setAwardee] = useState(null);
  const [canvasData, setCanvasData] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "firstName", headerName: "Firstname", width: 400 },
    { field: "lastName", headerName: "Lastname", width: 180 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const { onUpdate, email } = params.row;
        const invited = loadingInvitations.find((e) => e.email === email);
        const isInvited = invited?.hasInvitation;

        return (
          <LoadingButton
            loading={onUpdate}
            variant="contained"
            loadingIndicator="Inviting..."
            color={isInvited ? "success" : "warning"}
            onClick={() => handleSendInvitation(params.row)}
            size="small"
            startIcon={isInvited ? <ReplayIcon /> : <SendIcon />}
          >
            Invite
          </LoadingButton>
        );
      },
    },
  ];

  function handleSendInvitation(row) {
    setAwardee(row);
  }

  const initQualifiers = async () => {
    const qualifiersData = data.map((q, i) => {
      const fullName = `${q.firstName} ${q.lastName}`;

      return {
        id: i,
        firstName: q.firstName,
        lastName: q.lastName,
        fullName: fullName,
        email: q.email,
        onUpdate: false,
      };
    });

    const response = await AxiosInstance.get(`get-invited-awardees`);

    if (response.status === 200) {
      const currentInvitedAwardees = response.data;
      const invitations = createNewQualifiers(
        qualifiersData,
        currentInvitedAwardees
      );

      setOnProgres(false);
      setRows(qualifiersData);
      setLoadingInvitations(invitations);
    }
  };

  const fetchQualifiers = async () => {
    const response = await fetch(
      `https://leuteriorealty.com/natcon-qualifiers?api_key=85fba9c8-95a8-4ade-a41d-3be15f8f4aae&all=true&from=2024-08-01&lastdateX=2025-07-31&lastdateY=2025-08-05`
    );

    response.json().then(async (res) => {
      setOnProgres(true);

      const newQualifiers = res.map((el) => {
        const member = el.member[0];
        return {
          id: member.memberid,
          firstName: member.fn.toUpperCase(),
          lastName: member.ln.toUpperCase(),
          email: member.email,
          phone: member.mobile,
          onUpdate: false,
        };
      });

      // const tmpQualifiers = [...newQualifiers];
      const updatedQualifiers = newQualifiers.map((q, idx) => {
        return {
          ...q,
          id: idx + 1,
          firstName: q.firstName.toUpperCase(),
          lastName: q.lastName.toUpperCase(),
        };
      });

      const newResponse = await AxiosInstance.get(`get-invited-awardees`);

      if (newResponse.status === 200) {
        const currentInvitedAwardees = newResponse.data;
        const invitations = createNewQualifiers(
          updatedQualifiers,
          currentInvitedAwardees
        );

        setOnProgres(false);
        setRows(updatedQualifiers);
        setLoadingInvitations(invitations);
      }
    });
  };

  const createNewQualifiers = (data, curr) => {
    return data.map((el) => {
      return {
        email: el.email,
        name: `${el.firstName} ${el.lastName}`,
        invited: false,
        hasInvitation: curr.some((obj) => obj.email === el.email),
      };
    });
  };

  const updateInvitationProgress = (progress) => {
    const { id } = awardee;
    const tmpRows = [...rows];
    const index = tmpRows.findIndex((row) => row.id === id);

    if (index > -1) {
      tmpRows[index].onUpdate = progress;

      setRows(tmpRows);
    }
  };

  const uploadCanvasImage = async () => {
    try {
      const { firstName, lastName, email, id } = awardee;
      const name = firstName.toLowerCase();
      const imageURL = canvasData.toDataURL("image/jpeg", 0.8);
      const jsonParams = {
        canvas_image: imageURL,
        name: firstName,
        last: lastName,
        email: email,
        combined: name.includes(" & "),
      };

      updateInvitationProgress(true);

      const response = await AxiosInstance.post(
        "upload-image-canvas",
        jsonParams,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const tmpRows = [...loadingInvitations];
        const updatedData = {
          email: email,
          name: `${firstName} ${lastName}`,
          invited: false,
          hasInvitation: true,
        };
        const index = tmpRows.findIndex((r) => r.id === id);

        if (index > -1) {
          tmpRows[index] = updatedData;
        }

        setLoadingInvitations(tmpRows);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setAwardee(null);
      updateInvitationProgress(false);
    }
  };

  useEffect(() => {
    if (canvasData === null) {
      initQualifiers();
    }

    if (awardee !== null) {
      uploadCanvasImage();
    }
  }, [canvasData]);

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
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ marginBottom: 3 }}
              >
                LIST OF QUALIFIERS FOR INVITATION
              </Typography>
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <DataGrid
                  loading={onProgress}
                  rows={rows}
                  sx={{ borderRadius: 0, height: "92vh" }}
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
      {awardee !== null && (
        <InvitationNew awardee={awardee} setCanvas={setCanvasData} />
      )}
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

export default Invitation;
