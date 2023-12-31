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

const HEADERS = ["Object", "Message", "Date"];

function NotificationTable(props) {
  const { data } = props;
  return (
    <Paper sx={{ mt: { md: 3, xs: 1 }, mx: { md: 4, xs: 0 }, overflow: "hidden", borderRadius: 4 }}>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {HEADERS.map((headCell) => (
                <TableCell key={headCell} align="center" variant="head">
                  <Typography fontWeight={700}>{headCell}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

NotificationTable.propTypes = {
  data: PropTypes.array
};

export default NotificationTable;
