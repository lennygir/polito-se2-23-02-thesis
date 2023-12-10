import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProposalForm from "../components/ProposalForm";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function EditProposalPage(props) {
  const { fetchProposals, teachers, groups, degrees, setAlert } = props;
  const { handleErrors } = useContext(ErrorContext);
  const navigate = useNavigate();
  const location = useLocation();

  const proposal = location.state?.proposal;

  const editProposal = (proposal) => {
    API.updateProposal(proposal)
      .then(() => {
        setAlert({
          message: "Proposal updated successfully",
          severity: "success"
        });
        fetchProposals();
        navigate("/proposals");
      })
      .catch((err) => handleErrors(err));
  };

  return (
    <div id="edit-proposal-page">
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
        Edit Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalForm
            mode="update"
            teachers={teachers}
            groups={groups}
            degrees={degrees}
            proposal={proposal}
            editProposal={editProposal}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

EditProposalPage.propTypes = {
  fetchProposals: PropTypes.func,
  teachers: PropTypes.array,
  groups: PropTypes.array,
  degrees: PropTypes.array,
  setAlert: PropTypes.func
};

export default EditProposalPage;
