import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProposalForm from "../components/ProposalForm";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function CreateProposalPage(props) {
  const navigate = useNavigate();
  const { fetchProposals, proposals, teachers, groups, degrees, setAlert } = props;
  const { handleErrors } = useContext(ErrorContext);

  const [anchorEl, setAnchorEl] = useState();
  const openCopyMenu = Boolean(anchorEl);

  const [copiedProposal, setCopiedProposal] = useState(undefined);

  const handleOpenCopyMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCopyMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectedOption = (proposal) => {
    setCopiedProposal(proposal);
    handleCloseCopyMenu();
  };

  const createProposal = (proposal) => {
    API.createProposal(proposal)
      .then(() => {
        setAlert({
          message: "Proposal created successfully",
          severity: "success"
        });
        fetchProposals();
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
        <Button
          variant="contained"
          sx={{ mr: { md: 4, xs: 0 } }}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleOpenCopyMenu}
        >
          Copy from
        </Button>
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          anchorEl={anchorEl}
          open={openCopyMenu}
          onClose={handleCloseCopyMenu}
          sx={{ maxWidth: "400px" }}
          slotProps={{ paper: { sx: { borderRadius: 3, px: 1 } } }}
        >
          {proposals.map((proposal) => (
            <MenuItem key={proposal.id} onClick={() => handleSelectedOption(proposal)} sx={{ borderRadius: 2 }}>
              <Typography variant="inherit" noWrap>
                {proposal.title}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        New Thesis Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalForm
            mode="create"
            proposal={copiedProposal}
            teachers={teachers}
            groups={groups}
            degrees={degrees}
            proposals={proposals}
            createProposal={createProposal}
            setAlert={setAlert}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

CreateProposalPage.propTypes = {
  fetchProposals: PropTypes.func,
  proposals: PropTypes.array,
  teachers: PropTypes.array,
  groups: PropTypes.array,
  degrees: PropTypes.array,
  setAlert: PropTypes.func
};

export default CreateProposalPage;
