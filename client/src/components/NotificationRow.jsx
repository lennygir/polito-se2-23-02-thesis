import dayjs from "dayjs";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Badge, IconButton, Tooltip } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { NavLink } from "react-router-dom";

function NotificationRow(props) {
  const { notification } = props;

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
          >
            <Badge color="error" variant="dot">
              <EmailRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

NotificationRow.propTypes = {
  notification: PropTypes.object
};

export default NotificationRow;
