import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function ApplicationDetails(props) {
  const { proposal, getTeacherById, getDegreeById } = props;
  const supervisorTeacher = getTeacherById(proposal.supervisor);
  const degree = getDegreeById(proposal.cds);

  return (
    <>
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Student information
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Student ID: </span>
        {supervisorTeacher.id}
      </Typography>
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Full Name: </span>
        {supervisorTeacher.name + " " + supervisorTeacher.surname}
      </Typography>
      <Typography variant="subtitle1" gutterBottom paddingTop={1}>
        <span style={{ fontWeight: "bold" }}>Email: </span>
        {supervisorTeacher.email}
      </Typography>
      <Stack direction="row" spacing={5} alignItems="center">
        <Typography variant="subtitle1" gutterBottom paddingTop={1}>
          <span style={{ fontWeight: "bold" }}>View CV: </span>
        </Typography>
        <Button variant="outlined" startIcon={<AttachFileIcon />}>
          Student CV
        </Button>
      </Stack>
      <Typography variant="h5" gutterBottom paddingTop={2}>
        Thesis Proposal
      </Typography>
      <Divider />
      <Typography variant="subtitle1" gutterBottom paddingTop={2}>
        <span style={{ fontWeight: "bold" }}>Link: </span>
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
        <Stack direction="row" spacing={3}>
          <Button variant="outlined" fullWidth sx={{ mt: 3, mb: 2 }}>
            Reject
          </Button>
          <Button variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
            Accept
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default ApplicationDetails;
