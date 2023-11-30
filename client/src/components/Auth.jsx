import { LOGIN_URL, LOGOUT_URL } from "../utils/constants";
import { Button, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

function LoginButton() {
  const handleLogin = () => {
    window.location.replace(LOGIN_URL);
  };

  return (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>
      Log in to continue
    </Button>
  );
}

function LogoutButton() {
  const handleLogout = () => {
    window.location.replace(LOGOUT_URL);
  };

  return (
    <ListItemButton onClick={handleLogout}>
      <ListItemIcon>
        <LogoutRoundedIcon color="primary" />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
}

export { LoginButton, LogoutButton };
