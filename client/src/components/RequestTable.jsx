import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import RequestRow from "./RequestRow";

const HEADERS = ["Student", "Supervisor", "Title", "Status", "Open"];

function RequestTable(props) {
  const { requests } = props;

  return (
    <Paper sx={{ mt: 1, mx: { md: 4, xs: 0 }, overflow: "hidden", borderRadius: 4 }}>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {HEADERS.map((headCell) => (
                <TableCell
                  key={headCell}
                  align={headCell === "Status" || headCell === "Open" ? "center" : "inherit"}
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
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

RequestTable.propTypes = {
  requests: PropTypes.array
};

export default RequestTable;
