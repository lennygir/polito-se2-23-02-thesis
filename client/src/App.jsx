import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import ViewProposalPage from "./routes/ViewProposalPage";
import ViewApplicationPage from "./routes/ViewApplicationPage";
import API from "./utils/API";

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

  // Flag to indicate API fetch loading status
  const [loading, setLoading] = useState(false);

  // Current logged in user data
  const [user, setUser] = useState(undefined);

  // Current local date
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Static arrays of all teachers, groups and cds loaded once after login
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [degrees, setDegrees] = useState([]);

  // Dynamic arrays of proposals and applications, different depending on logged in user
  // Must be refreshed after some operations
  const [proposals, setProposals] = useState([]);
  const [applications, setApplications] = useState([]);

  // Message to be shown to the user after an API has been called
  const [alert, setAlert] = useState({
    message: "",
    severity: "success"
  });

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setDirty(true);
      navigate("/proposals");
      setAlert({
        message: "Welcome, " + user.name + "!",
        severity: "success"
      });
      await fetchStaticData();
    } catch (err) {
      handleErrors(err);
    }
  };

  const handleLogout = () => {
    setUser(undefined);
    navigate("/");
    setTeachers([]);
    setGroups([]);
    setDegrees([]);
    setProposals([]);
    setApplications([]);
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

  const fetchStaticData = async () => {
    try {
      const [teachers, groups, degrees] = await Promise.all([API.getTeachers(), API.getGroups(), API.getDegrees()]);
      setTeachers(teachers);
      setGroups(groups);
      setDegrees(degrees);
    } catch (err) {
      return handleErrors(err);
    }
  };

  const fetchDynamicData = async () => {
    try {
      await fetchProposals();
      await fetchApplications();
    } catch (err) {
      return handleErrors(err);
    }
  };

  const fetchProposals = async () => {
    try {
      if (user.role === "student") {
        const proposals = await API.getProposalsByDegree(user.cod_degree);
        setProposals(proposals);
      } else if (user.role === "teacher") {
        const proposals = await API.getProposalsByTeacher(user.id);
        setProposals(proposals);
      }
    } catch (err) {
      return handleErrors(err);
    }
  };

  const fetchApplications = async () => {
    try {
      if (user.role === "student") {
        const applications = await API.getApplicationsByStudent(user.id);
        setApplications(applications);
      } else if (user.role === "teacher") {
        const applications = await API.getApplicationsByTeacher(user.id);
        setApplications(applications);
      }
    } catch (err) {
      return handleErrors(err);
    }
  };

  // Re-fetch dynamic data when needed
  useEffect(() => {
    if (dirty) {
      setLoading(true);
      fetchDynamicData();
      setDirty(false);
      setLoading(false);
    }
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

  // Utility function to retrieve a teacher given its id
  const getTeacherById = (teacherId) => {
    return teachers.find((teacher) => teacher.id === teacherId);
  };

  // Utility function to retrieve a degree given its id
  const getDegreeById = (codDegree) => {
    return degrees.find((degree) => degree.cod_degree === codDegree);
  };

  return (
    <UserContext.Provider value={user}>
      <ErrorContext.Provider value={{ handleErrors }}>
        <Routes>
          {/* prettier-ignore */}
          <Route path="/" element={user ? <RootPage loading={loading} currentDate={currentDate} logout={handleLogout} fetchProposals={fetchProposals} fetchApplications={fetchApplications} /> : <LoginPage login={handleLogin} />}>
          <Route path="proposals" element={user ? <ProposalsPage proposals={proposals} teachers={teachers} groups={groups} degrees={degrees} getTeacherById={getTeacherById} /> : <Navigate replace to="/" />} />
          <Route path="proposals/:proposalId" element={user ? <ViewProposalPage setDirty={setDirty} getTeacherById={getTeacherById} getDegreeById={getDegreeById} setAlert={setAlert} applications={applications} /> : <Navigate replace to="/" />} />
          <Route path="add-proposal" element={user ? <CreateProposalPage fetchProposals={fetchProposals} teachers={teachers} groups={groups} degrees={degrees} setAlert={setAlert}/> : <Navigate replace to="/" />} />
          <Route path="applications" element={user ? <ApplicationsPage applications={applications} proposals={proposals} /> : <Navigate replace to="/" /> } />
          <Route path="applications/:applicationId" element={user ? <ViewApplicationPage fetchApplications={fetchApplications} setAlert={setAlert} applications={applications} /> : <Navigate replace to="/" />} />
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
