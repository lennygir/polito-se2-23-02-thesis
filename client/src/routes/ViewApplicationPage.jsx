import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ApplicationDetails from "../components/ApplicationDetails";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function ViewApplicationPage(props) {
  const location = useLocation();
  const { handleErrors } = useContext(ErrorContext);

  const application = location.state?.application;
  const proposal = location.state?.proposal;

  const evaluateApplication = (application) => {
    API.evaluateApplication(application)
      .then(() => {
        props.setAlert({
          message: "Application evaluated successfully",
          severity: "success"
        });
        props.fetchApplications();
        props.fetchNotifications();
      })
      .catch((err) => handleErrors(err));
  };

  return (
    <div id="view-application-page">
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          component={Link}
          to="/applications"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Application Details
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ApplicationDetails
            application={application}
            proposal={proposal}
            evaluateApplication={evaluateApplication}
            applications={props.applications}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default ViewApplicationPage;
