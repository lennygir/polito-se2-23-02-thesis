import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { Box } from "@mui/material";

const drawerWidth = 240;
const logoHeight = 70;

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
      </Box>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}

export default RootPage;
