import { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import  {MenuItem,Popover}  from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProposalForm from "../components/ProposalForm";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function CreateProposalPage(props) {
  const navigate = useNavigate();
  const { handleErrors } = useContext(ErrorContext);
  const [open, setOpen] = useState(null);
  const buttonRef = useRef(null);
  const [formData, setFormData] = useState(null)

  const createProposal = (proposal) => {
    API.createProposal(proposal)
      .then(() => {
        props.setAlert({
          message: "Proposal created successfully",
          severity: "success"
        });
        props.fetchProposals();
        navigate("/proposals");
      })
      .catch((err) => handleErrors(err));
  
    };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const fillForms = (proposal) => {
    setFormData({
      title: proposal.title,
      supervisor: proposal.supervisor,
      coSupervisors: proposal.co_supervisors,
      externalCoSupervisor: "",
      expirationDate: proposal.expiration_date,
      type: proposal.type,
      level: proposal.level=== "BSC" ? "Bachelor Degree" : "Master Degree",
      groups: proposal.groups,
      description: proposal.description,
      requiredKnowledge: proposal.required_knowledge,
      keywords: proposal.keywords,
      notes: proposal.notes,
      cds: proposal.cds
    });
    setOpen(null)
  }

  const renderItem = () =>{
      return (<>
        {props.proposals.map((proposal) => (
           <MenuItem onClick={()=>fillForms(proposal)}
           key={proposal.id} >
           {/* <ModeEditIcon sx={{ mr: 2 }} /> */}
           {proposal.title.substring(0, 50) + '...'}
         </MenuItem>
        ))}
        </>
      )
  }

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
      <Stack
      
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        // justifyContent="space-between"
        justifyContent="flex-end"
      >
        <Button
        ref={buttonRef}
        // aria-describedby="id"
        // open={open}
        //  onClick={handleCloseMenu}
        onClick={handleOpenMenu}
         variant="contained"
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Copy 
        </Button>
        <Popover
          // id="id"
          open={!!open}
          anchorEl={buttonRef.current}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
        {/* <MenuItem onClick={()=>handleEdit(proposal.id)}>
          <ModeEditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(proposal.id)} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
        {renderItem()}
      </Popover>
      </Stack>
      
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        New Thesis Proposal
      </Typography>
      <Paper elevation={1} sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ProposalForm
            teachers={props.teachers}
            groups={props.groups}
            degrees={props.degrees}
            createProposal={createProposal}
            fillData={formData}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default CreateProposalPage;
