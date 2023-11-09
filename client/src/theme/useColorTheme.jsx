import { createTheme, responsiveFontSizes } from "@mui/material";
import { useMemo, useState } from "react";
import { getDesignTokens } from "./theme";

export const useColorTheme = () => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const modifiedTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  return {
    theme: responsiveFontSizes(modifiedTheme),
    mode,
    toggleColorMode,
  };
};
