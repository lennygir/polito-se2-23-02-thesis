import dayjs from "dayjs";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import ButtonDatePicker from "./ButtonDatePicker";
import AccountPopover from "./AccountPopover";

function Navbar(props) {
  const { navbarHeight, drawerWidth, handleDrawerToggle, currentDate, setCurrentDate } = props;

  const handleDateChange = (newDate) => {
    setCurrentDate(dayjs(newDate).format("YYYY-MM-DD"));
    // Call other apis
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: "flex",
        justifyContent: "center",
        height: navbarHeight,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <ButtonDatePicker
          label={dayjs(currentDate).format("DD/MM/YYYY")}
          value={dayjs(currentDate)}
          minDate={dayjs(currentDate)}
          onChange={(newDate) => handleDateChange(newDate)}
        />

        <Box sx={{ flexGrow: 1 }} />

        <AccountPopover />
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  navbarHeight: PropTypes.number,
  drawerWidth: PropTypes.number,
  handleDrawerToggle: PropTypes.func,
  currentDate: PropTypes.string,
  setCurrentDate: PropTypes.func
};

export default Navbar;
