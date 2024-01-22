import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Fab,
  FormControlLabel,
  Hidden,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import RequestTable from "../components/RequestTable";
import UserContext from "../contexts/UserContext";
import RequestDetails from "../components/RequestDetails";
import EmptyTable from "../components/EmptyTable";

const infoMessage =
  "In order to start your thesis activity, you must submit a formal request. You can either create a thesis start request from this page after having discussed the topic with your supervisors, or you can create one from an accepted application in the application page.";

const steps = ["Request submitted", "Approved by a secretary clerk", "Approved by your supervisor"];

function RequestsPage(props) {
  const { requests, teachers } = props;
  const user = useContext(UserContext);

  const [lastActiveStep, setLastActiveStep] = useState(-1);
  const [viewAsCosupervisorOn, setViewAsCosupervisorOn] = useState(false);

  const getLastRequest = () => {
    const lastRequest = requests[requests.length - 1];
    return lastRequest;
  };

  const getActiveRequest = () => {
    const lastRequest = requests[requests.length - 1];
    if (lastRequest?.status === "rejected") {
      return null;
    }
    return lastRequest;
  };

  const getActiveStep = () => {
    const request = getLastRequest();
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
      case "changed":
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
    const activeRequest = getLastRequest();
    return activeRequest && activeRequest.status !== "rejected" && activeRequest.status !== "changes_requested";
  };

  const renderButtonIcon = () => {
    const activeRequest = getLastRequest();
    if (activeRequest) {
      if (isStartRequestButtonDisabled()) {
        return <ScheduleSendIcon />;
      } else if (activeRequest.status === "rejected") {
        return <AddIcon />;
      } else if (activeRequest.status === "changes_requested") {
        return <ModeEditIcon />;
      }
    } else {
      return <AddIcon />;
    }
  };

  const renderButtonLabel = () => {
    const activeRequest = getLastRequest();
    if (activeRequest) {
      if (isStartRequestButtonDisabled()) {
        return "Request sent";
      } else if (activeRequest.status === "rejected") {
        return "Start request";
      } else if (activeRequest.status === "changes_requested") {
        return "Edit request";
      }
    } else {
      return "Start request";
    }
  };

  const isTeacherSupervisor = (request) => request.supervisor === user.email;
  const isTeacherCoSupervisor = (request) => request.co_supervisors?.includes(user.email);

  const filteredTeacherRequests = requests.filter((request) => {
    if (viewAsCosupervisorOn) {
      return isTeacherCoSupervisor(request);
    } else {
      return isTeacherSupervisor(request);
    }
  });

  const handleSwitchChange = (event) => {
    setViewAsCosupervisorOn(event.target.checked);
  };

  const renderTable = () => {
    if (user.role === "teacher") {
      if (filteredTeacherRequests.length > 0) {
        return (
          <RequestTable
            requests={filteredTeacherRequests}
            teachers={teachers}
            viewAsCosupervisorOn={viewAsCosupervisorOn}
          />
        );
      } else {
        return <EmptyTable data="thesis start requests" />;
      }
    } else if (user.role === "secretary_clerk") {
      if (requests.length > 0) {
        return <RequestTable requests={requests} teachers={teachers} viewAsCosupervisorOn={viewAsCosupervisorOn} />;
      } else {
        return <EmptyTable data="thesis start requests" />;
      }
    }
  };

  return (
    <div id="requests-page">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{ paddingTop: { md: 4, xs: 1 }, paddingBottom: { md: 3, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}
        >
          {user.role === "student" ? "My Thesis Request" : "Thesis Requests"}
        </Typography>
        {user.role === "student" && (
          <Hidden smDown>
            <Button
              component={Link}
              to={getLastRequest()?.status === "changes_requested" ? "/edit-start-request" : "/add-start-request"}
              state={{ request: getActiveRequest() }}
              disabled={isStartRequestButtonDisabled()}
              variant="contained"
              sx={{ mr: 4 }}
              startIcon={renderButtonIcon()}
            >
              {renderButtonLabel()}
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
          {getLastRequest() ? (
            <Paper elevation={1} sx={{ mb: 5, pt: 1, mt: 3, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
              <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
                <RequestDetails request={getLastRequest()} requests={requests} />
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
      {user.role === "teacher" && (
        <Stack direction={{ md: "row", xs: "column" }} sx={{ marginX: { md: 5, xs: 0 } }}>
          <FormControlLabel
            sx={{ mt: { md: 0, xs: 1 }, pl: { md: 0, xs: 1 } }}
            control={<Switch checked={viewAsCosupervisorOn} onChange={handleSwitchChange} />}
            label="View as co-supervisor"
          />
        </Stack>
      )}
      {user.role !== "student" && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mx: { md: 4, xs: 0 } }}>{renderTable()}</Box>
      )}
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
              to="/add-start-request"
              aria-label="Add"
              color="primary"
              disabled={isStartRequestButtonDisabled()}
            >
              {renderButtonIcon()}
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
