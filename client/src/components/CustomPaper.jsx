import Paper from "@mui/material/Paper";

function CustomPaper(props) {
  return <Paper elevation={16} sx={{ borderRadius: 3, paddingX: 1 }} {...props} />;
}

export default CustomPaper;
