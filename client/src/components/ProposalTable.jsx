import { useContext } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ProposalRow from "./ProposalRow";
import UserContext from "../contexts/UserContext";
import { Typography } from "@mui/material";

const TEACHER_HEADERS = ["Thesis", "Expiration Date", ""];
const STUDENT_HEADERS = ["Supervisor", "Thesis", "Expiration Date"];

function ProposalTable(props) {
  const user = useContext(UserContext);

  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        maxHeight: "60vh",
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
                  <TableCell
                    key={headCell}
                    align={headCell === "Expiration Date" ? "center" : "inherit"}
                    variant="head"
                  >
                    <Typography fontWeight={700}>{headCell}</Typography>
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                TEACHER_HEADERS.map((headCell) => (
                  <TableCell
                    key={headCell}
                    align={headCell === "Expiration Date" ? "center" : "inherit"}
                    variant="head"
                  >
                    <Typography fontWeight={700}>{headCell}</Typography>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((proposal) => (
              <ProposalRow
                key={proposal.id}
                proposal={proposal}
                deleteProposal={props.deleteProposal}
                archiveProposal={props.archiveProposal}
                getTeacherById={props.getTeacherById}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ProposalTable;
