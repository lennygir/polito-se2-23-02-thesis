import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RequestForm from "../components/RequestForm";

function CreateRequestPage(props) {
  const { teachers, setAlert } = props;
  const createRequest = (request) => {
    console.log(request);
    setAlert({
      message: "Request submitted successfully, and you should wait for approval",
      severity: "success"
    });
  };

  return (
    <div id="create-proposal-page">
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          component={Link}
          to="/proposals"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Request Start Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <RequestForm createRequest={createRequest} teachers={teachers} />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

CreateRequestPage.propTypes = {
  teachers: PropTypes.array,
  setAlert: PropTypes.func
};

export default CreateRequestPage;
