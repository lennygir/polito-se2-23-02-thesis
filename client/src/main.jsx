import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeContextProvider } from "./theme/ThemeContextProvider.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Auth0Provider } from "@auth0/auth0-react";
import "@fontsource/montserrat";
import { SERVER_URL } from "./utils/constants.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeContextProvider>
        <Auth0Provider
          domain="dev-1vm3mj4g5zd43406.eu.auth0.com"
          clientId="8SqIkrmB3XXyh41yxIUdNIUtFbwO3pZO"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
          audience={SERVER_URL}
          scope="openid profile email"
        >
          <App />
        </Auth0Provider>
      </ThemeContextProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
