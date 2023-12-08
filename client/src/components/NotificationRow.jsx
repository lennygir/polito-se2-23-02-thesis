import { TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";

function NotificationRow(props) {
  const notification = props.notification;

  return (
    <TableRow key={notification.id}>
      <TableCell>{ notification.object }</TableCell>
      <TableCell>{ notification.content }</TableCell>
      <TableCell>{ dayjs(notification.date).format("DD/MM/YYYY") }</TableCell>
    </TableRow>
  );
}

export default NotificationRow;
