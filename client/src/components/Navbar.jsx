import dayjs from "dayjs";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Navbar(props) {
  const { mode } = useThemeContext();
  const user = useContext(UserContext);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${props.drawerWidth}px)` },
        ml: { sm: `${props.drawerWidth}px` }
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
          {user.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          component={Link}
          to="/settings"
          onClick={() => props.handleTabSelection("settings")}
          color={mode === "dark" ? "inherit" : "inherit"}
          variant="outlined"
          startIcon={<EditCalendarIcon />}
        >
          {dayjs(props.currentDate).format("DD/MM/YYYY")}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
