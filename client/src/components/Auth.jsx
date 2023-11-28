import { useAuth0 } from "@auth0/auth0-react";
import { Button, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={() => loginWithRedirect()}>
      Log in to continue
    </Button>
  );
}

function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <ListItemButton onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      <ListItemIcon>{<LogoutRoundedIcon color="primary" />}</ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
}

export { LoginButton, LogoutButton };
