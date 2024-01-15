import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Fab, Hidden, Paper, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import RequestTable from "../components/RequestTable";
import UserContext from "../contexts/UserContext";
import RequestDetails from "../components/RequestDetails";

const infoMessage =
  "In order to start your thesis activity, you must submit a formal request. You can either create a thesis start request from this page after having discussed the topic with your supervisors, or you can create one from an accepted application in the application page.";

const steps = ["Request submitted", "Approved by a secretary clerk", "Approved by your supervisor"];

function RequestsPage(props) {
  const { requests, teachers } = props;
  const user = useContext(UserContext);

  const [lastActiveStep, setLastActiveStep] = useState(-1);

  const getActiveRequest = () => {
    const lastRequest = requests[requests.length - 1];
    return lastRequest;
  };

  const getActiveStep = () => {
    const request = getActiveRequest();
    if (!request) {
      return -1;
    }
    let newActiveStep = -1;
    switch (request.status) {
      case "requested":
        newActiveStep = 1;
        break;
      case "secretary_accepted":
        newActiveStep = 2;
        break;
      case "started":
        newActiveStep = 3;
        break;
      case "changes_requested":
        return 2;
      default:
        return lastActiveStep;
    }
    if (newActiveStep !== lastActiveStep) {
      setLastActiveStep(newActiveStep);
    }
    return newActiveStep;
  };

  const isStartRequestButtonDisabled = () => {
    const activeRequest = getActiveRequest();
    return activeRequest && activeRequest.status !== "rejected";
  };

  return (
    <div id="requests-page">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          {user.role === "student" ? "My Thesis Request" : "Thesis Requests"}
        </Typography>
        {user.role === "student" && (
          <Hidden smDown>
            <Button
              component={Link}
              to="/add-request"
              disabled={isStartRequestButtonDisabled()}
              variant="contained"
              sx={{ mr: 4 }}
              startIcon={isStartRequestButtonDisabled() ? <ScheduleSendIcon /> : <AddIcon />}
            >
              {isStartRequestButtonDisabled() ? "Request sent" : "Start Request"}
            </Button>
          </Hidden>
        )}
      </Stack>
      {user.role === "student" && (
        <>
          <Alert sx={{ mt: 1, mx: { md: 4, xs: 0 }, borderRadius: 4 }} variant="outlined" severity="info">
            <Typography>{infoMessage}</Typography>
          </Alert>
          <Stepper sx={{ my: 5 }} activeStep={getActiveStep()} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getActiveRequest() ? (
            <Paper elevation={1} sx={{ mb: 5, pt: 1, mt: 3, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
              <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
                <RequestDetails request={getActiveRequest()} requests={requests} />
              </Box>
            </Paper>
          ) : (
            <Paper elevation={1} sx={{ mb: 5, pt: 1, mt: 3, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
              <Typography padding={4} textAlign="center">
                You have no active thesis start request at the moment. Start a new request to see it here.
              </Typography>
            </Paper>
          )}
        </>
      )}
      {user.role !== "student" && <RequestTable requests={requests} teachers={teachers} />}
      <Box height={5} marginTop={3} />
      {user.role === "student" && (
        <Hidden smUp>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "fixed", bottom: 24, right: 24 }}
          >
            <Fab
              component={Link}
              to="/add-request"
              aria-label="Add"
              color="primary"
              disabled={isStartRequestButtonDisabled()}
            >
              {isStartRequestButtonDisabled() ? <ScheduleSendIcon /> : <AddIcon />}
            </Fab>
          </Stack>
        </Hidden>
      )}
    </div>
  );
}

RequestsPage.propTypes = {
  requests: PropTypes.array,
  teachers: PropTypes.array
};

export default RequestsPage;
