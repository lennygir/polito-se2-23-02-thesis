import dayjs from "dayjs";
import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { useThemeContext } from "./theme/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import RootPage from "./routes/RootPage";
import ProposalsPage from "./routes/ProposalsPage";
import ApplicationsPage from "./routes/ApplicationsPage";
import NotificationsPage from "./routes/NotificationsPage";
import SettingsPage from "./routes/SettingsPage";
import ErrorPage from "./routes/ErrorPage";
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

  const [user, setUser] = useState(undefined);
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  return (
    <UserContext.Provider value={user}>
      <Routes>
        {/* prettier-ignore */}
        <Route path="/" element={user ? <RootPage currentDate={currentDate} logout={handleLogout} /> : <LoginPage login={handleLogin} />}>
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage currentDate={currentDate} setCurrentDate={setCurrentDate}/>} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
