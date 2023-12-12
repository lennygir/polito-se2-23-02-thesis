import { useContext } from "react";
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
const STUDENT_HEADERS = ["Teacher", "Proposal", "Status", "Open"];

function ApplicationTable(props) {
  const { applications } = props;
  const user = useContext(UserContext);

  return (
    <Paper sx={{ mt: { md: 3, xs: 1 }, mx: { md: 4, xs: 0 }, overflow: "hidden", borderRadius: 4 }}>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {user?.role === "student" &&
                STUDENT_HEADERS.map((headCell) => (
                  <TableCell key={headCell} align={headCell === "Status" ? "center" : "inherit"} variant="head">
                    <Typography fontWeight={700} fontSize={18}>
                      {headCell}
                    </Typography>
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                TEACHER_HEADERS.map((headCell) => (
                  <TableCell key={headCell} align={headCell === "Status" ? "center" : "inherit"} variant="head">
                    <Typography fontWeight={700} fontSize={18}>
                      {headCell}
                    </Typography>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ApplicationTable;
