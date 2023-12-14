import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import RequestTable from "../components/RequestTable";

function RequestsPage(props) {
  const { requests } = props;
  return (
    <div id="requests-page">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          Thesis Requests
        </Typography>
      </Stack>
      <RequestTable requests={requests} />
      <Box height={5} marginTop={3} />
    </div>
  );
}

RequestsPage.propTypes = {
  requests: PropTypes.array
};

export default RequestsPage;
