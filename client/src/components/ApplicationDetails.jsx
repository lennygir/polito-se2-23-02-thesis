import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UserContext from "../contexts/UserContext";

function ApplicationDetails(props) {
  const user = useContext(UserContext);
  const { application, proposal } = props;

  return (
    <>
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Student information
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Student ID: </span>
        {application.student_id}
      </Typography>
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Full Name: </span>
        {application.student_surname + " " + application.student_name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
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
      <Typography variant="h5" gutterBottom paddingTop={1}>
        Thesis Proposal
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Link to proposal: </span>
        <Link
          color="inherit"
          underline="always"
          component={NavLink}
          to={"/proposals/" + proposal.id}
          state={{ proposal: proposal }}
        >
          {proposal.title}
        </Link>
      </Typography>
      <Box paddingTop={5}>
        {application.state === "accepted" && (
          <Button fullWidth disabled variant="outlined">
            Application Accepted
          </Button>
        )}
        {application.state === "rejected" && (
          <Button fullWidth disabled variant="outlined">
            Application Rejected
          </Button>
        )}
        {application.state === "pending" && user?.role === "teacher" && (
          <Stack direction="row" spacing={3}>
            <Button variant="outlined" fullWidth sx={{ mt: 3, mb: 2 }}>
              Reject
            </Button>
            <Button variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
              Accept
            </Button>
          </Stack>
        )}
        {application.state === "pending" && user?.role === "student" && (
          <Button fullWidth disabled variant="outlined">
            Pending Application
          </Button>
        )}
      </Box>
    </>
  );
}

export default ApplicationDetails;
