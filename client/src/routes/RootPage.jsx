import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Box from "@mui/material/Box";

const drawerWidth = 240;
const logoHeight = 70;
const navbarHeight = 65;

function RootPage(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("proposals");

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabSelection = (tabId) => {
    setSelectedTab(tabId);
  };

  return (
    <div id="root-page">
      <Box sx={{ display: "flex" }}>
        <Navbar
          selectedTab={selectedTab}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          handleTabSelection={handleTabSelection}
          currentDate={props.currentDate}
        />
        <Sidebar
          selectedTab={selectedTab}
          logoHeight={logoHeight}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          closeDrawer={closeDrawer}
          handleDrawerToggle={handleDrawerToggle}
          handleTabSelection={handleTabSelection}
          logout={props.logout}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
            height: `calc(100vh - ${navbarHeight}px)`,
            marginTop: 8,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}

export default RootPage;
