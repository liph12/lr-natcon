import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import Invitation from "./components/Invitation";
import Registration from "./components/Registration";
import ViewAwardees from "./components/ViewAwardees";
import InvitationCard from "./components/InvitationCard";
import NatconIDGenerator from "./components/NatconIDGenerator";
import AxiosInstance from "./config/AxiosInstance";
import QRScanner from "./components/QRScanner";
import TicketGenerator from "./components/TicketGenerator";
import TicketDrawer from "./components/TicketDrawer";
import InvitationGenerator from "./components/InvitationGenerator";
import InvitationNew from "./components/InvitationNew";

AxiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";

  return config;
});

function App() {
  const theme = createTheme({
    palette: {
      type: "light",
      primary: {
        main: "#2d50d3",
      },
      secondary: {
        main: "#secondary",
      },
      success: {
        main: "#0F5818",
      },
      danger: {
        main: "#db2a2a",
      },
      dark: {
        main: "#0E0E0E",
      },
      warning: {
        main: "#cb9f00",
      },
      yellow: {
        main: "#fcce00",
      },
      lightWarning: {},
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/natcon-reg-2025" element={<Registration />} />
        <Route path="/view-awardees" element={<ViewAwardees />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/invitation-generator" element={<InvitationCard />} />
        <Route path="/id-generator" element={<NatconIDGenerator />} />
        <Route path="/ticket-generator" element={<TicketGenerator />} />
        <Route path="/ticket" element={<TicketDrawer />} />
        <Route path="/invitation-dummy" element={<InvitationGenerator />} />
        <Route path="/invitation-new" element={<InvitationNew />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
