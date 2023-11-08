import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import RootPage from "./routes/RootPage";
import { useThemeContext } from "./theme/ThemeContextProvider";

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
      <Route path="/" element={<RootPage />} />
    </Routes>
  );
}

export default App;
