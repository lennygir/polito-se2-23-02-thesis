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
  const { applications, proposals } = props;
  const user = useContext(UserContext);

  const getProposalById = (proposalId) => {
    return proposals.find((proposal) => proposal.id === proposalId);
  };

  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        maxHeight: "70vh",
        overflowY: "auto",
        borderRadius: 4,
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {user?.role === "student" &&
                STUDENT_HEADERS.map((headCell) => (
                  <TableCell
                    key={headCell}
                    align={headCell === "Status" ? "center" : "inherit"}
                  >
                    {headCell}
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                TEACHER_HEADERS.map((headCell) => (
                  <TableCell
                    key={headCell}
                    align={headCell === "Status" ? "center" : "inherit"}
                  >
                    {headCell}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => {
              // Get the proposal object for the current application
              const proposal = getProposalById(application.proposal_id);
              return (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  proposal={proposal}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ApplicationTable;
