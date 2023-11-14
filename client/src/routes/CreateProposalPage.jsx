import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProposalForm from "../components/ProposalForm";
import ErrorContext from "../contexts/ErrorContext";
import API from "../API";

function CreateProposalPage(props) {
  const navigate = useNavigate();
  const { handleErrors } = useContext(ErrorContext);

  const createProposal = (proposal) => {
    API.createProposal(proposal)
      .then(() => {
        props.setAlert({
          message: "Proposal created successfully",
          severity: "success",
        });
        props.setDirty(true);
        navigate("/proposals");
      })
      .catch((err) => handleErrors(err));
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
      <Typography
        variant="h4"
        sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}
      >
        New Thesis Proposal
      </Typography>
      <Paper
        elevation={1}
        sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}
      >
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalForm
            teachers={props.teachers}
            groups={props.groups}
            cds={props.cds}
            createProposal={createProposal}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default CreateProposalPage;
