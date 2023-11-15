import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ProposalRow from "./ProposalRow";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const TEACHER_HEADERS = ["Id", "Title", "Expiration Date", ""];
const STUDENT_HEADERS = ["Supervisor", "Title", "Expiration Date"];

function ProposalTable(props) {
  const user = useContext(UserContext);

  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        maxHeight: user?.role === "student" ? "60vh" : "70vh",
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
                    align={
                      headCell === "Expiration Date" ? "center" : "inherit"
                    }
                  >
                    {headCell}
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                TEACHER_HEADERS.map((headCell) => (
                  <TableCell
                    key={headCell}
                    align={
                      headCell === "Expiration Date" ? "center" : "inherit"
                    }
                  >
                    {headCell}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((proposal) => (
              <ProposalRow
                key={proposal.id}
                proposal={proposal}
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
