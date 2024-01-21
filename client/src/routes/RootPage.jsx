import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LoadingPage from "./LoadingPage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserContext from "../contexts/UserContext";

const drawerWidth = 240;
const logoHeight = 80;
const navbarHeight = 75;

function RootPage(props) {
  const {
    notifications,
    loading,
    setAlert,
    setDirty,
    currentDate,
    fetchProposals,
    fetchApplications,
    fetchNotifications,
    fetchRequests
  } = props;
  const user = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(user?.role === "secretary_clerk" ? "requests" : "proposals");

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
    } else if (tabId === "requests") {
      fetchRequests();
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
          setAlert={setAlert}
          setDirty={setDirty}
        />
        <Sidebar
          selectedTab={selectedTab}
          logoHeight={logoHeight}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          closeDrawer={closeDrawer}
          handleDrawerToggle={handleDrawerToggle}
          handleTabSelection={handleTabSelection}
          notifications={notifications}
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
  notifications: PropTypes.array,
  loading: PropTypes.bool,
  setAlert: PropTypes.func,
  setDirty: PropTypes.func,
  currentDate: PropTypes.string,
  fetchProposals: PropTypes.func,
  fetchApplications: PropTypes.func,
  fetchNotifications: PropTypes.func,
  fetchRequests: PropTypes.func
};

export default RootPage;
