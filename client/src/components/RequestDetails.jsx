import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ConfirmationDialog from "./ConfirmationDialog";
import UserContext from "../contexts/UserContext";
import { useThemeContext } from "../theme/ThemeContextProvider";

function RequestDetails(props) {
  const { theme } = useThemeContext();
  const { request, evaluateRequest, requests } = props;
  const user = useContext(UserContext);

  const [decision, setDecision] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    let message = "";
    if (decision === "approved") {
      message =
        "By submitting, you are indicating your approval for this request. Please note that this action is irreversible, and your decision will be communicated to the respective supervisor.";
    } else if (decision === "started") {
      message =
        "By submitting, you are indicating your acceptance for this request. Please note that this action is irreversible, and your decision will be communicated to the student to begin the thesis work.";
    } else if (decision === "rejected") {
      message =
        "By submitting, you are confirming your decision to reject this request. It's important to note that this action is irreversible.";
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
    if (decision === "approved") {
      request.decision = true;
    } else if (decision === "rejected") {
      request.decision = false;
    }
    evaluateRequest(request);
  };

  const renderActions = () => {
    const status = requests.find((req) => req.id === request.id).status;
    switch (status) {
      case "secretary_accepted":
        if (user.role === "secretary_clerk") {
          return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <AccessTimeIcon color="info" />
              <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.info.main }}>
                REQUEST APPROVED
              </Typography>
            </Box>
          );
        } else if (user.role === "teacher") {
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
                  setDecision("started");
                  handleOpenDialog();
                }}
              >
                Accept
              </Button>
            </Stack>
          );
        }
        break;
      case "requested":
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
                setDecision("approved");
                handleOpenDialog();
              }}
            >
              Approve
            </Button>
          </Stack>
        );
      case "rejected":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <HighlightOffIcon color="error" />
            <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.error.main }}>
              REQUEST REJECTED
            </Typography>
          </Box>
        );
      case "started":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CheckCircleOutlineIcon color="success" />
            <Typography variant="h6" fontWeight={700} style={{ color: theme.palette.success.main }}>
              REQUEST STARTED
            </Typography>
          </Box>
        );
      default:
        break;
    }
  };

  return (
    <>
      <ConfirmationDialog
        title="Confirm Decision"
        message={dialogMessage}
        primaryButtonLabel="Submit"
        secondaryButtonLabel="Cancel"
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleDecisionSubmit}
      />
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Student information
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Student ID: </span>
        {request.student_id}
      </Typography>

      <Typography variant="h5" gutterBottom paddingTop={2}>
        Supervisors
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Main supervisor: </span>
        {request.supervisor}
      </Typography>
      {request.co_supervisors && (
        <Typography variant="body1" gutterBottom>
          <span style={{ fontWeight: "bold" }}>Co-supervisors: </span>
          {request.co_supervisors.join(", ")}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Thesis Request
      </Typography>
      <Divider variant="middle" />
      <Typography variant="body1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Title: </span>
        {request.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Description: </span>
        {showMore ? `${request.description} ` : `${request.description.substring(0, 250)}... `}
        <Link component="button" variant="body2" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show less" : "Show more"}
        </Link>
      </Typography>

      <Box paddingTop={4} sx={{ display: "flex", justifyContent: "center" }}>
        {renderActions()}
      </Box>
    </>
  );
}

RequestDetails.propTypes = {
  request: PropTypes.object,
  evaluateRequest: PropTypes.func,
  requests: PropTypes.array
};

export default RequestDetails;
