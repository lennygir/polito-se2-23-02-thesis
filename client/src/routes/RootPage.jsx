import { useState } from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LoadingPage from "./LoadingPage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;
const logoHeight = 80;
const navbarHeight = 75;

function RootPage(props) {
  const { loading, currentDate, setCurrentDate, fetchProposals, fetchApplications, fetchNotifications } = props;
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
      fetchProposals();
    } else if (tabId === "applications") {
      fetchApplications();
    } else if (tabId === "notifications") {
      fetchNotifications();
    }
  };

  return (
    <div id="root-page">
      <Box sx={{ display: "flex" }}>
        <Navbar
          navbarHeight={navbarHeight}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <Sidebar
          selectedTab={selectedTab}
          logoHeight={logoHeight}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          closeDrawer={closeDrawer}
          handleDrawerToggle={handleDrawerToggle}
          handleTabSelection={handleTabSelection}
        />
        <Container maxWidth="lg">
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { md: 3, xs: 1 },
              width: "100%",
              height: `calc(100vh - ${navbarHeight}px)`,
              marginTop: { md: 8, xs: 11 }
            }}
          >
            {loading ? <LoadingPage loading={loading} /> : <Outlet />}
          </Box>
        </Container>
      </Box>
    </div>
  );
}

RootPage.propTypes = {
  loading: PropTypes.bool,
  currentDate: PropTypes.string,
  setCurrentDate: PropTypes.func,
  fetchProposals: PropTypes.func,
  fetchApplications: PropTypes.func,
  fetchNotifications: PropTypes.func
};

export default RootPage;
