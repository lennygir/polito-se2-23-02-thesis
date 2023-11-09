import { Box, Divider, FormControlLabel, Stack, Switch } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function SettingsPage() {
  return (
    <div id="settings-page">
      <Paper elevation={1}>
        <Typography variant="h4" padding={4}>
          Settings
        </Typography>
        <Box paddingLeft={5}>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Theme"
            labelPlacement="start"
          />
        </Box>
      </Paper>
    </div>
  );
}

export default SettingsPage;
