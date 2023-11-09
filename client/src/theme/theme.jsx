import { amber, deepOrange, grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
          primary: {
            main: "#1e4aa2",
          },
          secondary: {
            main: "#ef6c00",
          },
        }
      : {
          // Dark mode palette
        }),
  },
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});
