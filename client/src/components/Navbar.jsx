import dayjs from "dayjs";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { Link } from "react-router-dom";

function Navbar(props) {
  const { mode } = useThemeContext();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${props.drawerWidth}px)` },
        ml: { sm: `${props.drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Logged in as student
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          component={Link}
          to="/settings"
          onClick={() => props.handleTabSelection("settings")}
          color={mode === "dark" ? "inherit" : "inherit"}
          variant="outlined"
        >
          {dayjs(props.currentDate).format("DD/MM/YYYY")}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
