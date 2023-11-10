import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../components/ThemeToggle";
import DateSetting from "../components/DateSetting";

function SettingsPage(props) {
  return (
    <div id="settings-page">
      <Paper elevation={1}>
        <Typography variant="h4" padding={4}>
          Settings
        </Typography>
        <Box paddingX={5}>
          <ThemeToggle />
          <Divider />
          <DateSetting
            currentDate={props.currentDate}
            setCurrentDate={props.setCurrentDate}
          />
        </Box>
      </Paper>
    </div>
  );
}

export default SettingsPage;
