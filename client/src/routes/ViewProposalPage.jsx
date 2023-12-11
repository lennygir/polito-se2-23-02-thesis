import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProposalDetails from "../components/ProposalDetails";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function ViewProposalPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDirty, setAlert, getTeacherById, getDegreeById, applications } = props;
  const { handleErrors } = useContext(ErrorContext);

  const proposal = location.state?.proposal;

  const createApplication = (application) => {
    API.createApplication(application)
      .then(() => {
        setAlert({
          message: "Application sent successfully",
          severity: "success"
        });
        setDirty(true);
      })
      .catch((err) => handleErrors(err));
  };

  return (
    <div id="view-proposal-page">
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
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Thesis Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalDetails
            proposal={proposal}
            applications={applications}
            createApplication={createApplication}
            getTeacherById={getTeacherById}
            getDegreeById={getDegreeById}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

ViewProposalPage.propTypes = {
  setDirty: PropTypes.func,
  setAlert: PropTypes.func,
  getTeacherById: PropTypes.func,
  getDegreeById: PropTypes.func,
  applications: PropTypes.array
};

export default ViewProposalPage;
