import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Alert, Snackbar, ThemeProvider } from "@mui/material";
import { useThemeContext } from "./theme/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import RootPage from "./routes/RootPage";
import ProposalsPage from "./routes/ProposalsPage";
import CreateProposalPage from "./routes/CreateProposalPage";
import ApplicationsPage from "./routes/ApplicationsPage";
import NotificationsPage from "./routes/NotificationsPage";
import SettingsPage from "./routes/SettingsPage";
import ErrorPage from "./routes/ErrorPage";
import ErrorContext from "./contexts/ErrorContext";
import UserContext from "./contexts/UserContext";
import LoginPage from "./routes/LoginPage";
import API from "./API";

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

  // Flag to re-fetch data
  const [dirty, setDirty] = useState(false);

  // Current logged in user data
  const [user, setUser] = useState(undefined);

  // Current local date
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Static arrays of all teachers, groups and cds loaded once after login
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [cds, setCds] = useState([]);

  // Dynamic arrays of proposals and applications, different depending on logged in user
  // Must be refreshed after some operations
  const [proposals, setProposals] = useState([]);
  const [applications, setApplications] = useState([]);

  // Message to be shown to the user after an API has been called
  const [alert, setAlert] = useState({
    message: "",
    severity: "success",
  });

  const handleLogin = (credentials) => {
    API.logIn(credentials)
      .then((user) => {
        setUser(user);
        navigate("/proposals");
        setAlert({
          message: "Welcome, " + user.name + "!",
          severity: "success",
        });
      })
      .catch((err) => handleErrors(err));
  };

  const handleLogout = () => {
    setUser(undefined);
    navigate("/");
  };

  const handleErrors = (err) => {
    let errMsg;
    if (err.errors && err.errors[0] && err.errors[0].msg) {
      errMsg = err.errors[0].msg;
    } else if (err.error) {
      errMsg = err.error;
    } else if (err.message) {
      errMsg = err.message;
    } else {
      errMsg = JSON.stringify(err);
    }
    setAlert({ message: errMsg, severity: "error" });
  };

  const getTeachers = () => {
    // TODO: Call getTeachers API
    const teachers = [
      {
        id: 1,
        email: "mario@rossi.it",
      },
      {
        id: 2,
        email: "gianpiero.cabodi@polito.it",
      },
      {
        id: 3,
        email: "alessandro.savino@polito.it",
      },
    ];
    setTeachers(teachers);
  };

  const getGrups = () => {
    // TODO: Call getGroups API
    const groups = ["ELITE", "SOFTENG", "TORSEC"];
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

  useEffect(() => {
    // TODO: Re-fetch proposals
    setDirty(false);
  }, [dirty]);

  // Virtual clock
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentLocalDate = dayjs().format("YYYY-MM-DD");

      if (currentLocalDate !== currentDate) {
        // Update the state when the new day begins
        setCurrentDate(currentLocalDate);
      }
    }, 1000 * 60); // Check every minute

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [currentDate]);

  return (
    <UserContext.Provider value={user}>
      <ErrorContext.Provider value={{ handleErrors }}>
        <Routes>
          {/* prettier-ignore */}
          <Route path="/" element={user ? <RootPage currentDate={currentDate} logout={handleLogout} /> : <LoginPage login={handleLogin} />}>
          <Route path="proposals" element={user ? <ProposalsPage /> : <Navigate replace to="/" />} />
          <Route path="add-proposal" element={user ? <CreateProposalPage teachers={teachers} groups={groups} cds={cds} setDirty={setDirty} setAlert={setAlert}/> : <Navigate replace to="/" />} />
          <Route path="applications" element={user ? <ApplicationsPage /> : <Navigate replace to="/" /> } />
          <Route path="notifications" element={user ? <NotificationsPage /> : <Navigate replace to="/" />} />
          <Route path="settings" element={user ? <SettingsPage currentDate={currentDate} setCurrentDate={setCurrentDate}/> : <Navigate replace to="/" />} />
        </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={alert.message !== ""}
          onClose={() => setAlert({ ...alert, message: "" })}
          autoHideDuration={5000}
        >
          <Alert variant="filled" severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
      </ErrorContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
