import { Box, Stack, Typography } from '@mui/material';
import ProposalTable from '../components/ProposalTable';
import NotificationTable from '../components/NotificationTable';

function NotificationsPage(props) {
  const notifications = props.notifications;

  return <>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
        Notifications
      </Typography>
    </Stack>
    <NotificationTable data={notifications} />
    <Box height={5} marginTop={3} />
  </>;
}

export default NotificationsPage;
