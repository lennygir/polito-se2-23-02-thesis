import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RequestForm from "../components/RequestForm";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";
import { Menu, MenuItem } from "@mui/material";

function RequestPage(props) {
  console.log(props);
  const navigate = useNavigate();
  const { handleErrors } = useContext(ErrorContext);

  const [anchorEl, setAnchorEl] = useState();
  const openCopyMenu = Boolean(anchorEl);

  const [copiedProposal, setCopiedProposal] = useState(undefined);
  const [disableForm, setDisableForm] = useState(false);
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

  const createRequest = (proposal) => {
    //connection with API

    /**if request waite for approval */
    setDisableForm(true);
    props.setAlert({
      message: "Request submitted successfully, and you should wait for approval",
      severity: "success"
    });

    /**if request is rejected by API */
    // setDisableForm(false);
    // props.setAlert({
    //   message: "Your request is rejected, please send new request",
    //   severity: "warning"
    // });
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
          {props.proposals.map((proposal) => (
            <MenuItem key={proposal.id} onClick={() => handleSelectedOption(proposal)} sx={{ borderRadius: 2 }}>
              <Typography variant="inherit" noWrap>
                {proposal.title}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        New Request Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <RequestForm
            mode="create"
            proposal={copiedProposal}
            teachers={props.teachers}
            proposals={props.proposals}
            createRequest={createRequest}
            setAlert={props.setAlert}
            disableForm={disableForm}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default RequestPage;
