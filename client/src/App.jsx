import dayjs from "dayjs";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeContext } from "./theme/ThemeContextProvider";
import RootPage from "./routes/RootPage";
import ProposalsPage from "./routes/ProposalsPage";
import ApplicationsPage from "./routes/ApplicationsPage";
import NotificationsPage from "./routes/NotificationsPage";
import SettingsPage from "./routes/SettingsPage";
import ErrorPage from "./routes/ErrorPage";

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
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  return (
    <Routes>
      {/* prettier-ignore */}
      <Route path="/" element={<RootPage currentDate={currentDate} />}>
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage currentDate={currentDate} setCurrentDate={setCurrentDate}/>} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
