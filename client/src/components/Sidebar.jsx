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

const sidebarMainOptions = [
  {
    name: "Proposals",
    icon: <SchoolRoundedIcon />,
  },
  {
    name: "Applications",
    icon: <BookRoundedIcon />,
  },
  {
    name: "Notifications",
    icon: <EmailRoundedIcon />,
  },
];

const sidebarSecondaryOptions = [
  {
    name: "Settings",
    icon: <SettingsRoundedIcon />,
  },
  {
    name: "Logout",
    icon: <LogoutRoundedIcon />,
  },
];

function Sidebar(props) {
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
        <img src={logo} alt="PoliLogo" height={props.logoHeight} />
      </Box>
      <Divider />
      <List>
        {sidebarMainOptions.map((option) => (
          <ListItem key={option.name} disablePadding>
            <ListItemButton>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ marginTop: "auto" }}>
        {sidebarSecondaryOptions.map((option) => (
          <ListItem key={option.name} disablePadding>
            <ListItemButton>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
