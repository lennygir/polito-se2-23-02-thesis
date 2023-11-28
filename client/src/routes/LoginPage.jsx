import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "../assets/images/logo.png";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { LoginButton } from "../components/Auth";

function LoginPage(props) {
  const { mode } = useThemeContext();
  return (
    <div id="login-page">
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Box marginBottom={4}>
            <img
              src={logo}
              alt="PoliLogo"
              style={{
                filter: mode === "dark" ? "brightness(0) invert(1)" : "invert(0)"
              }}
              height={100}
            />
          </Box>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome
          </Typography>
          <LoginButton />
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;
