import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useLocation } from "react-router-dom";
import ApplicationDetails from "../components/ApplicationDetails";

function ViewApplicationPage(props) {
  const location = useLocation();

  const proposal = location.state?.proposal;

  return (
    <div id="view-application-page">
      <Stack
        paddingTop={4}
        sx={{ pt: { md: 4, xs: 0 } }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          component={Link}
          to="/applications"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ ml: { md: 4, xs: 0 } }}
        >
          Back
        </Button>
      </Stack>
      <Typography
        variant="h4"
        sx={{ paddingY: 4, marginLeft: { md: 4, xs: 0 } }}
      >
        Application Details
      </Typography>
      <Paper
        elevation={1}
        sx={{ mb: 5, pt: 2, borderRadius: 4, mx: { md: 4, xs: 0 } }}
      >
        <Box paddingX={5} sx={{ px: { md: 5, xs: 3 } }} paddingBottom={3}>
          <ApplicationDetails
            proposal={proposal}
            getTeacherById={props.getTeacherById}
            getDegreeById={props.getDegreeById}
          />
        </Box>
      </Paper>
      <Box height={3} />
    </div>
  );
}

export default ViewApplicationPage;
