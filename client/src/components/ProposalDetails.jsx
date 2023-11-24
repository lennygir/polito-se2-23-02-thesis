import dayjs from "dayjs";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import UserContext from "../contexts/UserContext";

function ProposalDetails(props) {
  const { proposal, applications, getTeacherById, getDegreeById } = props;
  const supervisorTeacher = getTeacherById(proposal.supervisor);
  const degree = getDegreeById(proposal.cds);
  const user = useContext(UserContext);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    setOpenDialog(false);
    const application = {
      proposal: proposal.id,
      student: user.id,
    };
    props.createApplication(application);
  };

  const isApplicationAccepted = () => {
    return applications.some((application) => application.state === "accepted");
  };

  const isWaitingOnDecision = () => {
    return applications.some((application) => application.state === "pending");
  };

  const isApplicationSent = () => {
    return applications.some(
      (application) => application.proposal_id === proposal.id
    );
  };

  const renderActionButton = () => {
    if (isApplicationAccepted()) {
      return null;
    }
    if (isWaitingOnDecision()) {
      return (
        <Button
          disabled
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleOpenDialog}
        >
          Waiting on decision
        </Button>
      );
    }
    if (isApplicationSent()) {
      return (
        <Button
          disabled
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleOpenDialog}
        >
          Application already sent
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleOpenDialog}
        >
          Send Application
        </Button>
      );
    }
  };

  return (
    <>
      {user?.role === "student" && (
        <Dialog maxWidth="xs" open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to submit your application for this thesis
              proposal? This action is irreversible, and your application will
              be sent to the supervisor for consideration.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingX: 3,
            }}
          >
            <Button fullWidth onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button fullWidth onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Typography variant="h5" gutterBottom paddingTop={2}>
        {proposal.title}
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Supervisor: </span>
        {supervisorTeacher.surname +
          " " +
          supervisorTeacher.name +
          " (" +
          supervisorTeacher.email +
          ")"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Co-supervisors: </span>
        {proposal.co_supervisors}
      </Typography>
      {proposal.keywords && proposal.keywords !== "" && (
        <Typography variant="subtitle1" gutterBottom>
          <span style={{ fontWeight: "bold" }}>Keywords: </span>
          {proposal.keywords}
        </Typography>
      )}
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Type: </span>
        {proposal.type}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Groups: </span>
        {proposal.groups}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Description: </span>
        {proposal.description}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Required knowledge: </span>
        {proposal.required_knowledge}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Expiration date: </span>
        {dayjs(proposal.expiration_date).format("DD MMMM YYYY")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Level: </span>
        {proposal.level === "MSC" ? "Master Degree" : "Bachelor Degree"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>CDS: </span>
        {degree.cod_degree + " " + degree.title_degree}
      </Typography>
      {proposal.notes && proposal.notes !== "" && (
        <Typography variant="subtitle1" gutterBottom>
          <span style={{ fontWeight: "bold" }}>Notes: </span>
          {proposal.notes}
        </Typography>
      )}
      {user.role === "student" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderActionButton()}
        </Box>
      )}
    </>
  );
}

export default ProposalDetails;
