import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Badge, IconButton, Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ErrorContext from "../contexts/ErrorContext";
import API from "../utils/API";

function NotificationRow(props) {
  const { notification, fetchNotifications } = props;
  const handleErrors = useContext(ErrorContext);

  const readNotification = async () => {
    if (!notification.read) {
      try {
        await API.readNotification(notification.id);
        await fetchNotifications();
      } catch (err) {
        handleErrors(err);
      }
    }
  };

  return (
    <TableRow key={notification.id}>
      <TableCell>thesis@polito.it</TableCell>
      <TableCell>{notification.object}</TableCell>
      <TableCell align="center">{dayjs(notification.date).format("DD/MM/YYYY")}</TableCell>
      <TableCell align="center">
        <Tooltip title="View notification">
          <IconButton
            component={NavLink}
            to={"/notifications/" + notification.id}
            state={{ notification: notification }}
            onClick={readNotification}
          >
            <Badge color="error" variant="dot" invisible={notification.read === 1}>
              <EmailRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

NotificationRow.propTypes = {
  notification: PropTypes.object,
  fetchNotifications: PropTypes.func
};

export default NotificationRow;
