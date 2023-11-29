import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import NotificationRow from "./NotificationRow";

const HEADERS = ["Object", "Message", "Date"];

function NotificationTable(props) {
  return (
    <Card
      sx={{
        marginTop: { md: 1, sm: 0 },
        marginX: { md: 4, sm: 0 },
        overflowY: "auto",
        borderRadius: 4
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {HEADERS.map((headCell) => (
                <TableCell
                  key={headCell}
                  align="center"
                  variant="head"
                >
                  <Typography fontWeight={700}>{headCell}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default NotificationTable;
