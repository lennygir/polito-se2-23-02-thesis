import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ApplicationTable from "../components/ApplicationTable";
import { Stack } from "@mui/material";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

function ApplicationsPage(props) {
  const user = useContext(UserContext);
  const { applications, proposals } = props;

  const studentView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          My Applications
        </Typography>
      </Stack>
      <ApplicationTable applications={applications} proposals={proposals} />
      <Box height={5} marginTop={3} />
    </>
  );

  const teacherView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          Applications
        </Typography>
      </Stack>
      <ApplicationTable applications={applications} proposals={proposals} />
      <Box height={5} marginTop={3} />
    </>
  );

  return <div id="application-page">{user?.role === "teacher" ? teacherView : studentView}</div>;
}

export default ApplicationsPage;
