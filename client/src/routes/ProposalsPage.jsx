import { useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Hidden from "@mui/material/Hidden";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UserContext from "../contexts/UserContext";

function ProposalsPage() {
  const user = useContext(UserContext);

  const fabStyle = {
    position: "absolute",
    bottom: 24,
    right: 24,
  };

  const studentView = <></>;

  const professorView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" padding={4}>
          My Proposals
        </Typography>
        <Hidden smDown>
          <Button
            component={Link}
            to="/add-proposal"
            variant="contained"
            sx={{ mr: 4 }}
          >
            New Proposal
          </Button>
        </Hidden>
        <Hidden smUp>
          <Fab
            component={Link}
            to="/add-proposal"
            sx={fabStyle}
            aria-label="Add"
            color="primary"
          >
            <AddIcon />
          </Fab>
        </Hidden>
      </Stack>
    </>
  );

  return (
    <div id="proposals-page">
      <Paper elevation={1}>
        {user?.role === "student" ? studentView : professorView}
      </Paper>
    </div>
  );
}

export default ProposalsPage;
