import { useContext } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ApplicationTable from "../components/ApplicationTable";
import UserContext from "../contexts/UserContext";
import EmptyTable from "../components/EmptyTable";

function ApplicationsPage(props) {
  const user = useContext(UserContext);
  const { applications } = props;

  return (
    <div id="application-page">
      <Typography
        variant="h4"
        sx={{ paddingTop: { md: 4, xs: 1 }, paddingBottom: { md: 3, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}
      >
        {user.role === "teacher" ? "Applications" : "My Applications"}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mx: { md: 4, xs: 0 } }}>
        {applications.length > 0 ? (
          <ApplicationTable applications={applications} />
        ) : (
          <EmptyTable data="applications" />
        )}
      </Box>
      <Box height={5} marginTop={3} />
    </div>
  );
}

ApplicationsPage.propTypes = {
  applications: PropTypes.array
};

export default ApplicationsPage;
