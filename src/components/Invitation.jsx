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
import InvitationCardFinal from "./InvitationCardFinal";

const offsetQualifiers = [
  {
    id: 107204714,
    firstName: "Marilyn and Percival",
    lastName: "Laranjo",
    mobile: "+639356625281",
    email: "lenlaranjo@gmail.com",
    onUpdate: false,
  },
  {
    id: 626194337,
    firstName: "Princess Rose",
    lastName: "Esposo",
    mobile: "+6309762000344",
    email: "filipinohomesmanilaph@gmail.com",
    onUpdate: false,
  },
  {
    id: 407140402,
    firstName: "Marc Jefferson",
    lastName: "Licayan",
    mobile: "+639367435777",
    email: "marc.leuteriorealty@gmail.com",
    onUpdate: false,
  },
  {
    id: 509184600,
    firstName: "Morena",
    lastName: "Banigan",
    mobile: "+639178915628",
    email: "klengbanigan101@yahoo.com",
    onUpdate: false,
  },
  {
    id: 831160619,
    firstName: "Mary Anne",
    lastName: "Tesiorna",
    mobile: "+639291044787",
    email: "ryefortalejo88@gmail.com",
    onUpdate: false,
  },
  {
    id: 1125185649,
    firstName: "Maria Teresa",
    lastName: "Aquino",
    mobile: "+639190028895",
    email: "teredan_3774@yahoo.com",
    onUpdate: false,
  },
  {
    id: 624233522,
    firstName: "Glaiza and Jerome",
    lastName: "Lantaca",
    mobile: "+6309564739372",
    email: "reandoyunyun@gmail.com",
    onUpdate: false,
  },
  {
    id: 312172156,
    firstName: "Marilou",
    lastName: "Goc-ong",
    mobile: "+639260850612",
    email: "mutz021984@gmail.com",
    onUpdate: false,
  },
  {
    id: 620233211,
    firstName: "Lehlet",
    lastName: "Arendain",
    mobile: "+639387827658",
    email: "arendainlehlet23@gmail.com",
    onUpdate: false,
  },
  {
    id: 1203142920,
    firstName: "Marjorie and Gilbert",
    lastName: "Monecillo",
    team: "Filipino Homes VIP",
    mobile: "+639171209248",
    email: "gilbertmonecillo28@gmail.com",
    onUpdate: false,
  },
  {
    id: 711180725,
    firstName: "Ada Mae and Jay Neil",
    lastName: "Roiles",
    team: "Red Diamonds",
    mobile: "+639773907922",
    email: "jnselior@gmail.com",
    onUpdate: false,
  },
  {
    id: 608173132,
    firstName: "Grace and Mike Noel III",
    lastName: "Chin",
    team: "Chin Dynasty",
    mobile: " +639177900891",
    email: "gtomtomchin@yahoo.com",
    onUpdate: false,
  },
  {
    id: 805144908,
    firstName: "Rebecca and Lyndon",
    lastName: "Quiao",
    team: "BEX Team",
    mobile: "+639985673503",
    email: "bexquiao@gmail.com",
    onUpdate: false,
  },
  {
    id: 808113616,
    firstName: "Monnien and Teody",
    lastName: "Embrado",
    team: "LR Alliance",
    mobile: "+639323717379",
    email: "jude.embrado@gmail.com",
    onUpdate: false,
  },
  {
    id: 1230114337,
    firstName: "Jenaido",
    lastName: "Quijano",
    team: "Dreamchasers",
    mobile: "+639165983608",
    email: "centralvisayasproperty@gmail.com",
    onUpdate: false,
  },
  {
    id: 819114522,
    firstName: "Lanie Rea and Marlou Angelo",
    lastName: "Hinay",
    team: "Team Royalties",
    mobile: "+639173188858",
    email: "cebuproperties4sale@gmail.com",
    onUpdate: false,
  },
  {
    id: 813112914,
    firstName: "Azela and Marlo",
    lastName: "Honor",
    team: "Team A",
    mobile: "+639171442234",
    email: "honor.azela@gmail.com",
    onUpdate: false,
  },
  {
    id: 813115049,
    firstName: "Melissa and Mark Anthony",
    lastName: "Villarubia",
    team: "Team X Factor",
    mobile: "+639150012431",
    email: "cebubestprojects@gmail.com",
    onUpdate: false,
  },
  {
    id: 320143754,
    firstName: "Jeaneth and Wire",
    lastName: "Estose",
    team: "Wire Toppers",
    mobile: "+639199909642",
    email: "wireestose1971@gmail.com",
    onUpdate: false,
  },
  {
    id: 320143754,
    firstName: "Jeaneth and Wire",
    lastName: "Estose",
    team: "Wire Toppers",
    mobile: "+639199909642",
    email: "wireestose1971@gmail.com",
    onUpdate: false,
  },
  {
    id: 1118153924,
    firstName: "Leslie And Fredo Jr.",
    lastName: "Gonzaga",
    team: "Leslie And Fredo Gonzaga Jr.",
    mobile: "+639498450725",
    email: "leslie_generale87@yahoo.com",
    onUpdate: false,
  },
  {
    id: 103145013,
    firstName: "Geoffrey Lidon and Jo Ann Cabrera",
    lastName: "Lidon",
    team: "Starshooters",
    mobile: "+639176246283",
    email: "geoffrey.lidon@gmail.com",
    onUpdate: false,
  },
  {
    id: 1204135628,
    firstName: "Angela Renee And Paul Josef",
    lastName: "Abarquez",
    team: "Starlight Team",
    mobile: "+639222741170",
    email: "abarquezangela@gmail.com",
    onUpdate: false,
  },
];

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
    // {
    //   field: "phone",
    //   headerName: "Mobile",
    //   width: 150,
    // },
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

  const findAndProcessInvitation = (email, invite) => {
    const index = loadingInvitations.findIndex((e) => e.email === email);
    const sentInvitation = structuredClone(loadingInvitations[index]);

    sentInvitation.invited = invite;

    const updatedInvitationStatus = loadingInvitations.slice();
    updatedInvitationStatus[index] = sentInvitation;
    setLoadingInvitations(updatedInvitationStatus);
  };

  const formatStrUpperFirstChar = (str) => {
    let strToLower = str.toLowerCase();
    let strArray = strToLower.split(" ");
    let actualStr = "";

    strArray.forEach((chars, idx) => {
      let subStr = chars[0].toUpperCase();

      for (let i in chars) {
        if (i > 0) {
          subStr += chars[i];
        }
      }

      actualStr += `${subStr}`;

      if (idx < strArray.length - 1) {
        actualStr += " ";
      }
    });

    return actualStr;
  };

  async function handleSendInvitation(row) {
    const { email, firstName, lastName, id } = row;
    const team = row?.team ?? null;

    const displayAwardee = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      team: team,
    };

    setAwardee(displayAwardee);
  }

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

      const tmpQualifiers = [...newQualifiers, ...offsetQualifiers];
      const updatedQualifiers = tmpQualifiers.map((q, idx) => {
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
        combined: name.includes(" and "),
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
      fetchQualifiers();
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
        <InvitationCardFinal awardee={awardee} setCanvas={setCanvasData} />
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
