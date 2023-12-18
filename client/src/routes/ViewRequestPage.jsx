import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
  const user = useContext(UserContext);
  const location = useLocation();
  const handleErrors = useContext(ErrorContext);

  const [changesMessage, setChangesMessage] = useState("");
  const [changesError, setChangesError] = useState("");
  const [openChangesDialog, setOpenChangesDialog] = useState(false);

  const request = location.state?.request;

  const evaluateRequest = (request) => {
    API.evaluateRequest(request)
      .then(() => {
        setAlert({
          message: "Request evaluated successfully",
          severity: "success"
        });
        fetchRequests();
      })
      .catch((err) => handleErrors(err));
  };

  const handleCloseDialog = () => {
    setOpenChangesDialog(false);
    setChangesError("");
  };

  const handleSubmit = () => {
    if (changesMessage.trim() === "") {
      setChangesError("Message cannot be empty");
      return;
    }
    handleCloseDialog();

    // TODO: Call API to submit message
    console.log(changesMessage);

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
        handleSubmit={handleSubmit}
      />
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          component={Link}
          to="/requests"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
        {user.role === "teacher" && request.status === "secretary_accepted" && (
          <Button
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
