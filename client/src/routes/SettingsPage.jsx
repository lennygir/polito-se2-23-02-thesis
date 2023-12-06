import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../components/ThemeToggle";

function SettingsPage() {
  return (
    <div id="settings-page">
      <Typography variant="h4" sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}>
        Settings
      </Typography>
      <Paper elevation={1} sx={{ mx: { md: 4, xs: 0 }, mt: { md: 1, sm: 0 }, borderRadius: 4 }}>
        <Box sx={{ px: { md: 5, xs: 2 } }}>
          <ThemeToggle />
        </Box>
      </Paper>
    </div>
  );
}

export default SettingsPage;
