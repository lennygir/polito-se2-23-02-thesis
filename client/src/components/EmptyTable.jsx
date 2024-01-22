import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

function EmptyTable(props) {
  const { data } = props;
  return (
    <Paper elevation={1} sx={{ borderRadius: 4, width: "100%" }}>
      <Typography padding={4} textAlign="center">
        There are no {data} here at the moment.
      </Typography>
    </Paper>
  );
}

EmptyTable.propTypes = {
  data: PropTypes.string
};

export default EmptyTable;
