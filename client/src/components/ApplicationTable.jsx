import { useContext } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ApplicationRow from "./ApplicationRow";
import UserContext from "../contexts/UserContext";

const TEACHER_HEADERS = ["Student", "Proposal", "Status", "Open"];
const STUDENT_HEADERS = ["Teacher", "Proposal", "Status", "Open"];

function ApplicationTable(props) {
  const { applications } = props;
  const user = useContext(UserContext);

  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        maxHeight: "70vh",
        overflowY: "auto",
        borderRadius: 4
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {user?.role === "student" &&
                STUDENT_HEADERS.map((headCell) => (
                  <TableCell key={headCell} align={headCell === "Status" ? "center" : "inherit"}>
                    {headCell}
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                TEACHER_HEADERS.map((headCell) => (
                  <TableCell key={headCell} align={headCell === "Status" ? "center" : "inherit"}>
                    {headCell}
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
    </Card>
  );
}

export default ApplicationTable;
