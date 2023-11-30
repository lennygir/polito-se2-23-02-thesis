import { Box, Fab, Stack, Tooltip, Typography } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import NotificationTable from "../components/NotificationTable";

function NotificationsPage(props) {
  const notifications = props.notifications;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          Notifications
        </Typography>
        <Fab
          size="small"
          sx={{ marginRight: { md: 6, xs: 1 } }}
          color="primary"
          onClick={() => props.fetchNotifications()}
        >
          <Tooltip title="Update">
            <ReplayIcon />
          </Tooltip>
        </Fab>
      </Stack>
      <NotificationTable data={notifications} />
      <Box height={5} marginTop={3} />
    </>
  );
}

export default NotificationsPage;
