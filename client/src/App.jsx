import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import ErrorContext from "./contexts/ErrorContext";
import UserContext from "./contexts/UserContext";
import LoginPage from "./routes/LoginPage";
import ViewProposalPage from "./routes/ViewProposalPage";
import ViewApplicationPage from "./routes/ViewApplicationPage";
import API from "./utils/API";
import EditProposalPage from "./routes/EditProposalPage";
import AppAlert from "./components/AppAlert";

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
  const [notifications, setNotifications] = useState([]);

  // Message to be shown to the user after an API has been called
  const [alert, setAlert] = useState({
    message: "",
    severity: "success"
  });

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

  const fetchDynamicData = async () => {
    try {
      await fetchProposals();
      await fetchApplications();
      await fetchNotifications();
    } catch (err) {
      return handleErrors(err);
    }
  };

  const fetchProposals = async () => {
    API.getProposals()
      .then((proposals) => setProposals(proposals))
      .catch((err) => handleErrors(err));
  };

  const fetchApplications = async () => {
    API.getApplications()
      .then((applications) => setApplications(applications))
      .catch((err) => handleErrors(err));
  };

  const fetchNotifications = async () => {
    API.getNotifications()
      .then((notifications) => setNotifications(notifications))
      .catch((err) => handleErrors(err));
  };

  // At launch only
  useEffect(() => {
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

    // Check if user is logged in
    API.getUserInfo()
      .then((user) => {
        setUser(user);
        setDirty(true);
        navigate("/proposals");
        setAlert({
          message: "Welcome, " + user.name + "!",
          severity: "success"
        });
        fetchStaticData();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Re-fetch dynamic data when needed
  useEffect(() => {
    if (dirty) {
      setLoading(true);
      fetchDynamicData();
      setDirty(false);
      setLoading(false);
    }
  }, [dirty]);

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
          <Route path="/" element={user ? <RootPage loading={loading} currentDate={currentDate} setCurrentDate={setCurrentDate} fetchProposals={fetchProposals} fetchApplications={fetchApplications} fetchNotifications={fetchNotifications} /> : <LoginPage />}>
            <Route path="proposals" element={user ? <ProposalsPage setAlert={setAlert} currentDate={currentDate} setDirty={setDirty} proposals={proposals} applications={applications} teachers={teachers} groups={groups} degrees={degrees} getTeacherById={getTeacherById} /> : <Navigate replace to="/" />} />
            <Route path="proposals/:proposalId" element={user ? <ViewProposalPage setDirty={setDirty} getTeacherById={getTeacherById} getDegreeById={getDegreeById} setAlert={setAlert} applications={applications} /> : <Navigate replace to="/" />} />
            <Route path="add-proposal" element={user ? <CreateProposalPage fetchProposals={fetchProposals} proposals={proposals} teachers={teachers} groups={groups} degrees={degrees} setAlert={setAlert}/> : <Navigate replace to="/" />} />
            <Route path="edit-proposal/:proposalId" element={user ? <EditProposalPage fetchProposals={fetchProposals} teachers={teachers} groups={groups} degrees={degrees} setAlert={setAlert}/> : <Navigate replace to="/" />} />
            <Route path="applications" element={user ? <ApplicationsPage applications={applications} /> : <Navigate replace to="/" /> } />
            <Route path="applications/:applicationId" element={user ? <ViewApplicationPage fetchApplications={fetchApplications} fetchNotifications={fetchNotifications} setAlert={setAlert} applications={applications} /> : <Navigate replace to="/" />} />
            <Route path="notifications" element={user ? <NotificationsPage notifications={notifications} fetchNotifications={fetchNotifications} /> : <Navigate replace to="/" />} />
            <Route path="settings" element={user ? <SettingsPage currentDate={currentDate} setCurrentDate={setCurrentDate} /> : <Navigate replace to="/" />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <AppAlert alert={alert} setAlert={setAlert} />
      </ErrorContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
