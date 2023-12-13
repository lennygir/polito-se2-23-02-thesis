import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../theme/ThemeContextProvider";
import logo from "../assets/images/logo.png";

function ErrorPage() {
  const { mode } = useThemeContext();
  const navigate = useNavigate();
  return (
    <div id="error-page">
      <Container maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
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
          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            Oops...
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" component="p">
            This is not the route you&apos;re looking for.
          </Typography>
          <Box marginTop={4}>
            <Button variant="contained" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ErrorPage;
