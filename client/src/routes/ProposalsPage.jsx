import { useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Hidden from "@mui/material/Hidden";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UserContext from "../contexts/UserContext";
import ProposalTable from "../components/ProposalTable";

const proposals = [
  {
    id: 1,
    supervisor: "marco.torchiano@polito.it",
    title:
      "Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1 Proposta number 1",
    expirationDate: "10/01/2024",
  },
  {
    id: 2,
    supervisor: "marco.torchiano@polito.it",
    title: "Proposta number 2",
    expirationDate: "15/04/2024",
  },
  {
    id: 3,
    supervisor: "marco.torchiano@polito.it",
    title: "Proposta number 3",
    expirationDate: "01/03/2024",
  },
];

function ProposalsPage() {
  const user = useContext(UserContext);

  const studentView = <></>;

  const professorView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}
        >
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
      </Stack>
      <ProposalTable data={proposals} />
      <Hidden smUp>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <Fab
            component={Link}
            to="/add-proposal"
            aria-label="Add"
            color="primary"
          >
            <AddIcon />
          </Fab>
        </Stack>
      </Hidden>
    </>
  );

  return (
    <div id="proposals-page">
      {user?.role === "student" ? studentView : professorView}
    </div>
  );
}

export default ProposalsPage;
