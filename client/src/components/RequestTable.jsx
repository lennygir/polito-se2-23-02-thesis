import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import RequestRow from "./RequestRow";
import { Stack } from "@mui/material";

const HEADERS = ["Student", "Supervisor", "Title", "Status", "Open"];

const LEGEND = `• REQUESTED: the request has been issued by a student
                • APPROVED: the request has been approved by a secretary clerk
                • STARTED: the request has been accepted by a teacher
                • REJECTED: the request has been rejected by a secretary clerk or a teacher`;

function RequestTable(props) {
  const { requests, teachers } = props;

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
                  {headCell === "Status" ? (
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography fontWeight={700} fontSize={18}>
                        {headCell}
                      </Typography>
                      <Tooltip
                        title={LEGEND}
                        arrow
                        slotProps={{ tooltip: { sx: { whiteSpace: "pre-line", maxWidth: "none" } } }}
                      >
                        <IconButton size="small">
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Typography fontWeight={700} fontSize={18}>
                      {headCell}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} teachers={teachers} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

RequestTable.propTypes = {
  requests: PropTypes.array,
  teachers: PropTypes.array
};

export default RequestTable;
