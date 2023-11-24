import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UserContext from "../contexts/UserContext";
import dayjs from "dayjs";

function ApplicationDetails(props) {
  const user = useContext(UserContext);
  const { application, proposal } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [decision, setDecision] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDecision(null);
  };

  const handleDecisionSubmit = () => {
    setOpenDialog(false);

    const newApplication = {
      id: application.id,
      state: decision,
    };
    props.evaluateApplication(newApplication);
  };

  const isApplicationAccepted = () => {
    return props.applications.some(
      (a) => a.id === application.id && a.state === "accepted"
    );
  };

  const isApplicationRejected = () => {
    return props.applications.some(
      (a) => a.id === application.id && a.state === "rejected"
    );
  };

  const renderActionButton = () => {
    if (isApplicationAccepted()) {
      return (
        <Button fullWidth disabled variant="outlined">
          Application Accepted
        </Button>
      );
    }
    if (isApplicationRejected()) {
      return (
        <Button fullWidth disabled variant="outlined">
          Application Rejected
        </Button>
      );
    }
    if (user.role === "teacher") {
      return (
        <Stack direction="row" spacing={3}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              handleOpenDialog();
              setDecision("rejected");
            }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              handleOpenDialog();
              setDecision("accepted");
            }}
          >
            Accept
          </Button>
        </Stack>
      );
    }
    if (user.role === "student" && application.state === "pending") {
      return (
        <Button fullWidth disabled variant="outlined">
          Pending Application
        </Button>
      );
    }
  };

  return (
    <>
      {user?.role === "teacher" && (
        <Dialog maxWidth="xs" open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Decision</DialogTitle>
          <DialogContent>
            <DialogContentText>
              By confirming, you will
              {decision === "accepted" ? " accept" : " reject"} this
              application. This action is irreversible, and your decision will
              be sent to the student.
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
            <Button
              fullWidth
              onClick={handleDecisionSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Student information
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Student ID: </span>
        {application.student_id}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Full Name: </span>
        {application.student_surname + " " + application.student_name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Email: </span>
        {application.student_id + "@studenti.polito.it"}
      </Typography>
      <Stack direction="row" spacing={5} alignItems="center" marginY={3}>
        <Typography variant="subtitle1">
          <span style={{ fontWeight: "bold" }}>View CV: </span>
        </Typography>
        <Button variant="outlined" startIcon={<AttachFileIcon />}>
          Student CV
        </Button>
      </Stack>
      <Typography variant="h5" gutterBottom>
        Thesis Proposal
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Title: </span>
        {proposal?.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <span style={{ fontWeight: "bold" }}>Expiration date: </span>
        {dayjs(proposal?.expiration_date).format("MMMM D, YYYY")}
      </Typography>
      <Box paddingTop={4}>{renderActionButton()}</Box>
    </>
  );
}

export default ApplicationDetails;
