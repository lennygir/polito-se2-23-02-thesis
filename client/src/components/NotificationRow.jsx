import dayjs from "dayjs";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function NotificationRow(props) {
  const { notification } = props;

  return (
    <TableRow key={notification.id}>
      <TableCell>{notification.object}</TableCell>
      <TableCell>{notification.content}</TableCell>
      <TableCell>{dayjs(notification.date).format("DD/MM/YYYY")}</TableCell>
    </TableRow>
  );
}

NotificationRow.propTypes = {
  notification: PropTypes.object
};

export default NotificationRow;
