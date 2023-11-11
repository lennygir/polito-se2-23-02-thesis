import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { useThemeContext } from "./theme/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import RootPage from "./routes/RootPage";
import ProposalsPage from "./routes/ProposalsPage";
import CreateProposalPage from "./routes/CreateProposalPage";
import ApplicationsPage from "./routes/ApplicationsPage";
import NotificationsPage from "./routes/NotificationsPage";
import SettingsPage from "./routes/SettingsPage";
import ErrorPage from "./routes/ErrorPage";
import UserContext from "./contexts/UserContext";
import LoginPage from "./routes/LoginPage";

function App() {
  const { theme } = useThemeContext();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </BrowserRouter>
  );
}

function Main() {
  const navigate = useNavigate();

  const [user, setUser] = useState(undefined);
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [cds, setCds] = useState([]);

  const handleLogin = (credentials) => {
    // TODO: Call login API
    setUser({ name: "Mario Rossi", role: "professor" });
    navigate("/proposals");
  };

  const handleLogout = () => {
    // TODO: Call logout API
    setUser(undefined);
    navigate("/");
  };

  const getTeachers = () => {
    // TODO: Call getTeachers API
    const teachers = ["Mario Rossi", "Gianpiero Cabodi", "Alessandro Savino"];
    setTeachers(teachers);
  };

  const getGrups = () => {
    // TODO: Call getGroups API
    const groups = ["ELITE", "SOFTEND", "TORSEC"];
    setGroups(groups);
  };

  const getCds = () => {
    // TODO: Call getCds API
    const cds = [
      "(LM-32) Computer Engineering",
      "(LM-23) Civil Engineering",
      "(LM-33) Mechanical Engineering",
      "(LM-25) Automotive Engineering",
      "(LM-29) Chemical Engineering",
      "(LM-22) Aerospace Engineering",
      "(LM-04) Architecture",
    ];
    setCds(cds);
  };

  useEffect(() => {
    // Fetch data to get the proposals
    getTeachers();
    getGrups();
    getCds();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Routes>
        {/* prettier-ignore */}
        <Route path="/" element={user ? <RootPage currentDate={currentDate} logout={handleLogout} /> : <LoginPage login={handleLogin} />}>
          <Route path="proposals" element={user ? <ProposalsPage /> : <Navigate replace to="/" />} />
          <Route path="add-proposal" element={user ? <CreateProposalPage teachers={teachers} groups={groups} cds={cds} /> : <Navigate replace to="/" />} />
          <Route path="applications" element={user ? <ApplicationsPage /> : <Navigate replace to="/" /> } />
          <Route path="notifications" element={user ? <NotificationsPage /> : <Navigate replace to="/" />} />
          <Route path="settings" element={user ? <SettingsPage currentDate={currentDate} setCurrentDate={setCurrentDate}/> : <Navigate replace to="/" />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
