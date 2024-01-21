import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ReplayIcon from "@mui/icons-material/Replay";
import NotificationTable from "../components/NotificationTable";
import EmptyTable from "../components/EmptyTable";

function NotificationsPage(props) {
  const { notifications, fetchNotifications } = props;

  return (
    <div id="notifications-page">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          Notifications
        </Typography>
        <Fab size="small" sx={{ marginRight: { md: 6, xs: 1 } }} color="primary" onClick={() => fetchNotifications()}>
          <Tooltip title="Update">
            <ReplayIcon />
          </Tooltip>
        </Fab>
      </Stack>
      {notifications.length > 0 ? (
        <NotificationTable data={notifications} fetchNotifications={fetchNotifications} />
      ) : (
        <EmptyTable data="notifications" />
      )}
      <Box height={5} marginTop={3} />
    </div>
  );
}

NotificationsPage.propTypes = {
  notifications: PropTypes.array,
  fetchNotifications: PropTypes.func
};

export default NotificationsPage;
