import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeContextProvider } from "./theme/ThemeContextProvider.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@fontsource/montserrat";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
