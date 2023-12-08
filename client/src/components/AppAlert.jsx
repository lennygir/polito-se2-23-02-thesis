import PropTypes from "prop-types";
import { Alert, Slide, Snackbar } from "@mui/material";

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}

function AppAlert({ alert, setAlert }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, message: "" });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={alert.message !== ""}
      onClose={handleClose}
      autoHideDuration={5000}
      TransitionComponent={TransitionRight}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={alert.severity}
        sx={{ display: "flex", alignItems: "center", width: "100%", pr: 3, borderRadius: 4 }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
}

AppAlert.propTypes = {
  alert: PropTypes.object,
  setAlert: PropTypes.func
};

export default AppAlert;
