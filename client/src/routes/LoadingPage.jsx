import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

function LoadingPage(props) {
  const { loading } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}
    >
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? "800ms" : "0ms"
        }}
        unmountOnExit
      >
        <CircularProgress />
      </Fade>
    </Box>
  );
}

LoadingPage.propTypes = {
  loading: PropTypes.bool
};

export default LoadingPage;
