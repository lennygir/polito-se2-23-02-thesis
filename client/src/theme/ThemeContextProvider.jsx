import { createTheme } from "@mui/material";
import { createContext, useContext } from "react";
import { useColorTheme } from "./useColorTheme";
import PropTypes from "prop-types";

export const ThemeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
  theme: createTheme()
});

export const ThemeContextProvider = ({ children }) => {
  const value = useColorTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeContextProvider.propTypes = {
  children: PropTypes.node
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
