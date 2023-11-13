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
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useThemeContext } from "../theme/ThemeContextProvider";

const sidebarMainTabs = [
  {
    id: "proposals",
    label: "Theses",
    icon: <SchoolRoundedIcon color="primary" />,
    path: "/proposals",
  },
  {
    id: "applications",
    label: "Applications",
    icon: <BookRoundedIcon color="primary" />,
    path: "/applications",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <EmailRoundedIcon color="primary" />,
    path: "/notifications",
  },
];

const settingsTab = {
  id: "settings",
  label: "Settings",
  icon: <SettingsRoundedIcon color="primary" />,
  path: "/settings",
};

const logoutTab = {
  id: "logout",
  label: "Logout",
  icon: <LogoutRoundedIcon color="primary" />,
};

function Sidebar(props) {
  const { mode } = useThemeContext();

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box
        marginY={3}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <img
          src={logo}
          alt="PoliLogo"
          style={{
            filter: mode === "dark" ? "brightness(0) invert(1)" : "invert(0)",
          }}
          height={props.logoHeight}
        />
      </Box>
      <Divider />
      <List>
        {sidebarMainTabs.map((tab) => (
          <ListItem key={tab.id} disablePadding>
            <ListItemButton
              component={Link}
              to={tab.path}
              selected={props.selectedTab === tab.id}
              onClick={() => {
                props.handleTabSelection(tab.id);
                props.closeDrawer();
              }}
            >
              <ListItemIcon>{tab.icon}</ListItemIcon>
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
              selected={props.selectedTab === settingsTab.id}
              onClick={() => {
                props.handleTabSelection(settingsTab.id);
                props.closeDrawer();
              }}
            >
              <ListItemIcon>{settingsTab.icon}</ListItemIcon>
              <ListItemText primary={settingsTab.label} />
            </ListItemButton>
          </ListItem>
          <ListItem key={logoutTab.id} disablePadding>
            <ListItemButton
              selected={props.selectedTab === logoutTab.id}
              onClick={() => {
                props.handleTabSelection(logoutTab.id);
                props.closeDrawer();
                props.logout();
              }}
            >
              <ListItemIcon>{logoutTab.icon}</ListItemIcon>
              <ListItemText primary={logoutTab.label} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={props.mobileOpen}
        onClose={props.handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: props.drawerWidth,
          },
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
            width: props.drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
