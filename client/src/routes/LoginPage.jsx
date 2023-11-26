import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "../assets/images/logo.png";
import { useThemeContext } from "../theme/ThemeContextProvider";
import { useState } from "react";
import validator from "validator";

function LoginPage(props) {
  const { mode } = useThemeContext();

  // Form fields
  const [email, setEmail] = useState("marco.torchiano@polito.it");
  const [password, setPassword] = useState("s123456");

  // Form errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to validate user input
  const validateCredentials = () => {
    const errors = { email: "", password: "" };

    // Check email
    if (validator.isEmpty(email)) {
      errors.email = "Please provide an email";
    } else if (!validator.isEmail(email)) {
      errors.email = "Please provide a valid email";
    }
    // Check password
    if (validator.isEmpty(password)) {
      errors.password = "Please provide a password";
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    const errors = validateCredentials();
    if (errors.email !== "" || errors.password !== "") {
      setEmailError(errors.email);
      setPasswordError(errors.password);
    } else {
      // Call login API
      const credentials = { email, password };
      props.login(credentials);
    }
  };

  return (
    <div id="login-page">
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="on" sx={{ mt: 1 }}>
            <TextField
              autoComplete="on"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              error={!!emailError}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError("");
              }}
              helperText={emailError}
            />
            <TextField
              autoComplete="on"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={password}
              error={!!passwordError}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              helperText={passwordError}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;
