import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RequestDetails from "../components/RequestDetails";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function ViewRequestPage(props) {
  const location = useLocation();
  const { fetchRequests, setAlert, requests } = props;
  const handleErrors = useContext(ErrorContext);

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

  return (
    <div id="view-request-page">
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
