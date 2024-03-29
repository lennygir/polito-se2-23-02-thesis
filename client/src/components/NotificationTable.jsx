import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import NotificationRow from "./NotificationRow";

const HEADERS = ["From", "Object", "Date", "Open"];

function NotificationTable(props) {
  const { data, fetchNotifications } = props;
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "60vh", overflow: "auto", borderRadius: 4 }}>
      <Table sx={{ minWidth: 650 }} stickyHeader>
        <TableHead>
          <TableRow>
            {HEADERS.map((headCell) => (
              <TableCell
                key={headCell}
                align={headCell === "Open" || headCell === "Date" ? "center" : "left"}
                variant="head"
              >
                <Typography fontWeight={700}>{headCell}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              fetchNotifications={fetchNotifications}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

NotificationTable.propTypes = {
  data: PropTypes.array,
  fetchNotifications: PropTypes.func
};

export default NotificationTable;
