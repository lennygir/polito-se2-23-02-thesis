import { useContext } from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ApplicationRow from "./ApplicationRow";
import UserContext from "../contexts/UserContext";

const TEACHER_HEADERS = ["Student", "Proposal", "Status", "Open"];
const STUDENT_HEADERS = ["Supervisor", "Proposal", "Status", "Open"];

function generateTableHeaders(headers, align) {
  return headers.map((headCell) => (
    <TableCell key={headCell} align={headCell === "Status" || headCell === "Open" ? "center" : align} variant="head">
      <Typography fontWeight={700} fontSize={18}>
        {headCell}
      </Typography>
    </TableCell>
  ));
}

function ApplicationTable(props) {
  const { applications } = props;
  const user = useContext(UserContext);
  const headers = user?.role === "student" ? STUDENT_HEADERS : TEACHER_HEADERS;

  const customSort = (a, b) => {
    // If the status is "accepted", prioritize it
    if (a.state === "accepted") {
      return -1;
    } else if (b.state === "accepted") {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "60vh", overflow: "auto", borderRadius: 4 }}>
      <Table sx={{ minWidth: 650 }} stickyHeader>
        <TableHead>
          <TableRow>{generateTableHeaders(headers, "inherit")}</TableRow>
        </TableHead>
        <TableBody>
          {applications.sort(customSort).map((application) => (
            <ApplicationRow key={application.id} application={application} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ApplicationTable.propTypes = {
  applications: PropTypes.array
};

export default ApplicationTable;
