import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
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
  return (
    <Routes>
      <Route path="/" element={<RootPage />}>
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
