import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Hidden from "@mui/material/Hidden";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import UserContext from "../contexts/UserContext";
import ProposalTable from "../components/ProposalTable";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import API from "../API";
import ProposalFilters from "../components/ProposalFilters";

function ProposalsPage() {
  const user = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [proposals, setProposals] = useState([]);
  const [dirty, setDirty] = useState(false);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filterProposals = () => {
    return proposals.filter((p) => {
      return (
        p.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.supervisor.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  };

  const studentView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}
        >
          Theses Proposals
        </Typography>
      </Stack>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: 96,
          marginX: { md: 3, xs: -1 },
        }}
      >
        <OutlinedInput
          sx={{ borderRadius: 4, width: { md: "300px", xs: "200px" } }}
          placeholder="Search proposal..."
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon
                sx={{ color: "text.disabled", width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
        <ProposalFilters />
      </Toolbar>
      <ProposalTable data={filterProposals()} />
    </>
  );

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

  if (user?.role === "student") {
    // Fetch data to get the proposals on first render & when dirty changes
    useEffect(() => {
      API.getProposalsByDegree(user.cod_degree).then((proposals) => {
        setProposals(proposals);
      });
    }, [dirty]);

    return <div id="proposals-page">{studentView}</div>;
  } else {
    return <div id="proposals-page">{professorView}</div>;
  }
}

export default ProposalsPage;
