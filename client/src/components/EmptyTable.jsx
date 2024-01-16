import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

function EmptyTable(props) {
  const { data } = props;
  return (
    <Paper elevation={1} sx={{ mb: 5, pt: 1, mt: 3, borderRadius: 4, mx: { md: 4, xs: 0 } }}>
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
