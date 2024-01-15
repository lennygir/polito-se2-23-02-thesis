import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ChangeRequestDialog from "../components/ChangeRequestDialog";
import RequestDetails from "../components/RequestDetails";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import API from "../utils/API";

function ViewRequestPage(props) {
  const { fetchRequests, setAlert, requests } = props;
  const handleErrors = useContext(ErrorContext);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [changesMessage, setChangesMessage] = useState("");
  const [changesError, setChangesError] = useState("");
  const [openChangesDialog, setOpenChangesDialog] = useState(false);
  const [request, setRequest] = useState(location.state?.request);

  const evaluateRequest = async (req) => {
    try {
      await API.evaluateRequest(req);
      setAlert({
        message:
          req.decision === "changes_requested" ? "Changes requested successfully" : "Request evaluated successfully",
        severity: "success"
      });
      await fetchRequests();
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    const updatedRequest = requests.find((r) => r.id === request.id);
    if (updatedRequest) {
      setRequest(updatedRequest);
    }
  }, [requests]);

  const handleCloseDialog = () => {
    setOpenChangesDialog(false);
    setChangesError("");
  };

  const handleSubmitChangeRequest = () => {
    if (changesMessage.trim() === "") {
      setChangesError("Message cannot be empty");
      return;
    }
    request.decision = "changes_requested";
    request.message = changesMessage;

    evaluateRequest(request);
    handleCloseDialog();
    setChangesMessage("");
  };

  return (
    <div id="view-request-page">
      <ChangeRequestDialog
        changesMessage={changesMessage}
        setChangesMessage={setChangesMessage}
        changesError={changesError}
        setChangesError={setChangesError}
        open={openChangesDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmitChangeRequest}
      />
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
        {user.role === "teacher" &&
          (request.status === "secretary_accepted" || request.status === "changes_requested") && (
            <Button
              disabled={request.status === "changes_requested"}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ mr: { md: 4, xs: 0 } }}
              onClick={() => setOpenChangesDialog(true)}
            >
              Request changes
            </Button>
          )}
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Request Details
      </Typography>
      {request.status === "changes_requested" && (
        <Paper elevation={1} sx={{ mb: 3, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
          <Stack
            paddingX={5}
            paddingY={3}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>Changes requested: </span>
              {request.changes_requested}
            </Typography>
            <Chip label="WAITING FOR CHANGES" size="small" color="info" />
          </Stack>
        </Paper>
      )}
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <RequestDetails request={request} evaluateRequest={evaluateRequest} requests={requests} />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

ViewRequestPage.propTypes = {
  fetchRequests: PropTypes.func,
  setAlert: PropTypes.func,
  requests: PropTypes.array
};

export default ViewRequestPage;
