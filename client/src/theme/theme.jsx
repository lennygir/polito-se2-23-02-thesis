import { amber, deepOrange, grey } from "@mui/material/colors";

const theme = {
  palette: {
    primary: amber,
  },
};

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#1e4aa2",
          },
          secondary: {
            main: "ef6c00",
          },
        }
      : {}),
  },
});

export default theme;
