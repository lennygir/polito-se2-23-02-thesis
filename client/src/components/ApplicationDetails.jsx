import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import UserContext from "../contexts/UserContext";
import ConfirmationDialog from "./ConfirmationDialog";
import { useThemeContext } from "../theme/ThemeContextProvider";

function ApplicationDetails(props) {
  const user = useContext(UserContext);
  const { theme } = useThemeContext();
  const { application, evaluateApplication, applications } = props;

  const [decision, setDecision] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    let message = "";
    if (decision === "accepted") {
      message =
        "By submitting, you will accept this application. This action is irreversible, and your decision will be sent to the student.";
    } else if (decision === "rejected") {
      message =
        "By submitting, you will reject this application. This action is irreversible, and your decision will be sent to the student.";
    }
    setDialogMessage(message);
  }, [decision]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDecision(null);
  };

  const handleDecisionSubmit = () => {
    setOpenDialog(false);

    const newApplication = {
      id: application.id,
      state: decision
    };
    evaluateApplication(newApplication);
  };

  const isApplicationAccepted = () => {
    return applications.some((a) => a.id === application.id && a.state === "accepted");
  };

  const isApplicationRejected = () => {
    return applications.some((a) => a.id === application.id && a.state === "rejected");
  };

  const isApplicationCanceled = () => {
    return applications.some((a) => a.id === application.id && a.state === "canceled");
  };

  const renderActionButton = () => {
    if (isApplicationAccepted()) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CheckCircleOutlineIcon color="success" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.success.main }}>
            APPLICATION ACCEPTED
          </Typography>
        </Box>
      );
    }
    if (isApplicationRejected()) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <HighlightOffIcon color="error" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.error.main }}>
            APPLICATION REJECTED
          </Typography>
        </Box>
      );
    }
    if (isApplicationCanceled()) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ErrorOutlineIcon color="warning" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.warning.main }}>
            APPLICATION CANCELED
          </Typography>
        </Box>
      );
    }
    if (user.role === "teacher") {
      return (
        <Stack direction="row" spacing={3} sx={{ width: "100%" }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              setDecision("rejected");
              handleOpenDialog();
            }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              setDecision("accepted");
              handleOpenDialog();
            }}
          >
            Accept
          </Button>
        </Stack>
      );
    }
    if (user.role === "student" && application.state === "pending") {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AccessTimeIcon color="info" />
          <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.info.main }}>
            APPLICATION PENDING
          </Typography>
        </Box>
      );
    }
  };

  return (
    <>
      {user?.role === "teacher" && (
        <ConfirmationDialog
          mode="submit"
          message={dialogMessage}
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleDecisionSubmit}
        />
      )}
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Student information
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Student ID: </span>
        {application.student_id}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Full Name: </span>
        {application.student_surname + " " + application.student_name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Email: </span>
        {application.student_id + "@studenti.polito.it"}
      </Typography>
      <Stack direction="row" spacing={5} alignItems="center" marginY={3}>
        <Typography variant="body1">
          <span style={{ fontWeight: "bold" }}>View CV: </span>
        </Typography>
        <Button variant="outlined" startIcon={<AttachFileIcon />}>
          Student CV
        </Button>
      </Stack>
      <Typography variant="h5" gutterBottom>
        Thesis Proposal
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Title: </span>
        {application.title}
      </Typography>
      <Box paddingTop={4} sx={{ display: "flex", justifyContent: "center" }}>
        {renderActionButton()}
      </Box>
    </>
  );
}

ApplicationDetails.propTypes = {
  application: PropTypes.object,
  evaluateApplication: PropTypes.func,
  applications: PropTypes.array
};

export default ApplicationDetails;
