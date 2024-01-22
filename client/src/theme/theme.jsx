import { NAVY, ORANGE, ROSE, LIGHT_BACKGROUND, DARK_BACKGROUND, WHITE } from "../utils/constants";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
          // Blue Navy
          primary: NAVY,
          // Orange
          secondary: ORANGE,
          // White
          background: LIGHT_BACKGROUND
        }
      : {
          // Dark mode palette
          // Orange
          primary: ORANGE,
          // Blue Navy
          secondary: NAVY,
          // Deep Blue
          background: DARK_BACKGROUND
        }),
    rose: ROSE,
    white: WHITE
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    fontSize: 14,
    h4: {
      fontWeight: 700,
      color: mode === "light" ? "#00192A" : "#FFF"
    },
    h5: {
      fontWeight: 700,
      color: mode === "light" ? "#00192A" : "#FFF"
    },
    body1: {
      fontWeight: 500
    },
    body2: {
      fontWeight: 500,
      fontSize: 16
    },
    button: {
      fontWeight: 700
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
          height: "40px"
        },
        outlined: {
          border: "1px solid"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: mode === "light" ? "#00192A" : "#FFF"
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "18px"
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        middle: {
          border: "2px solid",
          color: "#2AA8FF",
          width: "30px",
          marginLeft: 0
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: 8,
          paddingRight: 8,
          marginBottom: 3
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "48px"
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: "18px"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "18px"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: "19px"
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          top: 5
        }
      }
    }
  }
});
