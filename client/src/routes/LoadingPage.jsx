import { Box, CircularProgress, Fade } from "@mui/material";

function LoadingPage(props) {
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
        in={props.loading}
        style={{
          transitionDelay: props.loading ? "800ms" : "0ms"
        }}
        unmountOnExit
      >
        <CircularProgress />
      </Fade>
    </Box>
  );
}

export default LoadingPage;
