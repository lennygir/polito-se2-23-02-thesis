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
import ProposalRow from "./ProposalRow";
import UserContext from "../contexts/UserContext";

const STUDENT_HEADERS = ["Supervisor", "Thesis", "Expiration Date"];

function ProposalTable(props) {
  const user = useContext(UserContext);
  const { headers, data, deleteProposal, archiveProposal, getTeacherById, teacherFilter, applications, currentDate } =
    props;

  return (
    <Paper sx={{ mt: { xs: 1 }, mx: { md: 4, xs: 0 }, overflow: "hidden", borderRadius: 4 }}>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {user?.role === "student" &&
                STUDENT_HEADERS.map((headCell) => (
                  <TableCell key={headCell} align={headCell === "Expiration" ? "center" : "inherit"} variant="head">
                    <Typography fontWeight={700} fontSize={18}>
                      {headCell}
                    </Typography>
                  </TableCell>
                ))}
              {user?.role === "teacher" &&
                headers.map((headCell) => (
                  <TableCell
                    key={headCell}
                    align={headCell === "Expiration" || headCell === "Reason" ? "center" : "inherit"}
                    variant="head"
                  >
                    <Typography fontWeight={700} fontSize={18}>
                      {headCell}
                    </Typography>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((proposal) => (
              <ProposalRow
                key={proposal.id}
                proposal={proposal}
                deleteProposal={deleteProposal}
                archiveProposal={archiveProposal}
                getTeacherById={getTeacherById}
                teacherFilter={teacherFilter}
                applications={applications}
                currentDate={currentDate}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

ProposalTable.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.array,
  deleteProposal: PropTypes.func,
  archiveProposal: PropTypes.func,
  getTeacherById: PropTypes.func,
  teacherFilter: PropTypes.string,
  applications: PropTypes.array,
  currentDate: PropTypes.string
};

export default ProposalTable;
