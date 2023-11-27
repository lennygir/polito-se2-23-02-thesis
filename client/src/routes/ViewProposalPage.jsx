import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProposalDetails from "../components/ProposalDetails";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function ViewProposalPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleErrors } = useContext(ErrorContext);

  const proposal = location.state?.proposal;
  const applications = props.applications;

  const createApplication = (application) => {
    API.insertApplication(application)
      .then(() => {
        props.setAlert({
          message: "Application sent successfully",
          severity: "success"
        });
        props.setDirty(true);
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
        {/* TODO: if applications.find(proposal.id === proposal.id) => disable button */}
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalDetails
            proposal={proposal}
            applications={applications}
            createApplication={createApplication}
            getTeacherById={props.getTeacherById}
            getDegreeById={props.getDegreeById}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default ViewProposalPage;
