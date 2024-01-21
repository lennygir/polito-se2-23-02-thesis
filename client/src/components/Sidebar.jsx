import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ApprovalIcon from "@mui/icons-material/Approval";
import logo from "../assets/images/logo.png";
import UserContext from "../contexts/UserContext";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { LogoutButton } from "./Auth";
import { Badge } from "@mui/material";

const sidebarTabs = [
  {
    id: "proposals",
    label: "Proposals",
    icon: <SchoolRoundedIcon color="primary" />,
    path: "/proposals"
  },
  {
    id: "applications",
    label: "Applications",
    icon: <BookRoundedIcon color="primary" />,
    path: "/applications"
  },
  {
    id: "requests",
    label: "Start Requests",
    icon: <ApprovalIcon color="primary" />,
    path: "/requests"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <EmailRoundedIcon color="primary" />,
    path: "/notifications"
  }
];

const settingsTab = {
  id: "settings",
  label: "Settings",
  icon: <SettingsRoundedIcon color="primary" />,
  path: "/settings"
};

function Sidebar(props) {
  const { mode } = useThemeContext();
  const { selectedTab, logoHeight, drawerWidth, mobileOpen, closeDrawer, handleDrawerToggle, handleTabSelection } =
    props;
  const user = useContext(UserContext);

  const renderTabs = () => {
    let tabs = [];
    switch (user.role) {
      case "student":
        tabs = sidebarTabs.map((tab) => (tab.id === "requests" ? { ...tab, label: "Start Request" } : tab));
        break;
      case "teacher":
        tabs = sidebarTabs;
        break;
      case "secretary_clerk":
        tabs = sidebarTabs.filter((tab) => tab.id === "requests");
        break;
      default:
        break;
    }
    return tabs;
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Box marginY={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={logo}
          alt="PoliLogo"
          style={{
            filter: mode === "dark" ? "brightness(0) invert(1)" : "invert(0)"
          }}
          height={logoHeight}
        />
      </Box>
      <Divider />
      <List>
        {renderTabs().map((tab) => (
          <ListItem key={tab.id} disablePadding>
            <ListItemButton
              component={Link}
              to={tab.path}
              selected={selectedTab === tab.id}
              onClick={() => {
                handleTabSelection(tab.id);
                closeDrawer();
              }}
            >
              <ListItemIcon>
                {tab.id === "notifications" ? (
                  <Badge color="error" badgeContent={1} max={99}>
                    {tab.icon}
                  </Badge>
                ) : (
                  tab.icon
                )}
              </ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <List>
          <ListItem key={settingsTab.id} disablePadding>
            <ListItemButton
              component={Link}
              to={settingsTab.path}
              selected={selectedTab === settingsTab.id}
              onClick={() => {
                handleTabSelection(settingsTab.id);
                closeDrawer();
              }}
            >
              <ListItemIcon>{settingsTab.icon}</ListItemIcon>
              <ListItemText primary={settingsTab.label} />
            </ListItemButton>
          </ListItem>
          <ListItem key="logout" disablePadding>
            <LogoutButton />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

Sidebar.propTypes = {
  selectedTab: PropTypes.string,
  logoHeight: PropTypes.number,
  drawerWidth: PropTypes.number,
  mobileOpen: PropTypes.bool,
  closeDrawer: PropTypes.func,
  handleDrawerToggle: PropTypes.func,
  handleTabSelection: PropTypes.func
};

export default Sidebar;
