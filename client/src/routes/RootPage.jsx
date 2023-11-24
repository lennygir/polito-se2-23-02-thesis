import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Box from "@mui/material/Box";
import LoadingPage from "./LoadingPage";
import { Container } from "@mui/material";

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
    if (tabId === "proposals") {
      props.fetchProposals();
    } else if (tabId === "applications") {
      props.fetchApplications();
    }
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
        <Container maxWidth="lg">
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
            {props.loading ? (
              <LoadingPage loading={props.loading} />
            ) : (
              <Outlet />
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default RootPage;
