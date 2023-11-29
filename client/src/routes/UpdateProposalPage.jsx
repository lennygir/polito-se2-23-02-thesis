import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";
import ProposalUpdateForm from "../components/ProposalUpdateForm";

function UpdateProposalPage(props) {
  const navigate = useNavigate();
  const id  = useParams()['proposalId'];
  const { handleErrors } = useContext(ErrorContext);
  const [editProposal, setEditProposal] = useState(null);
  // const [dirty, setDirty] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let temp = await props.proposals.filter((proposal) => {
        if(proposal.id == id){
          return proposal
        }
      })
      if(temp==null || temp.length==0){
        navigate('/proposals', { replace: true });
      }
      setEditProposal(temp)
    }
    fetchData()
  }, [id]);

  const updateProposal = (proposal,id) => {
    API.updateProposal(proposal,id)
      .then(() => {
        props.setAlert({
          message: "Proposal updated successfully",
          severity: "success"
        });
        // props.fetchProposals();
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
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Edit Thesis Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
        {editProposal==null ? (
        <p>Loading...</p>
      ) : (
          <ProposalUpdateForm
            teachers={props.teachers}
            groups={props.groups}
            degrees={props.degrees}
            updateProposal={updateProposal}
            editProposal={editProposal}
          />
      )}
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default UpdateProposalPage;
