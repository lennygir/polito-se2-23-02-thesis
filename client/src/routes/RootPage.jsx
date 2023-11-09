import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 240;
const logoHeight = 70;
const navbarHeight = 65;

function RootPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div id="root-page">
      <Box sx={{ display: "flex" }}>
        <Navbar
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Sidebar
          logoHeight={logoHeight}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: `calc(100vh - ${navbarHeight}px)`,
            marginTop: 8,
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}

export default RootPage;
