import { createTheme, responsiveFontSizes, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import { getDesignTokens } from "./theme";

export const useColorTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const modifiedTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return {
    theme: responsiveFontSizes(modifiedTheme),
    mode,
    toggleColorMode
  };
};
