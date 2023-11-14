import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
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
import ProposalFilters from "../components/ProposalFilters";

function ProposalsPage(props) {
  const proposals = props.proposals;
  const user = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProposals, setFilteredProposals] = useState([]);

  useEffect(() => {
    setFilteredProposals(proposals);
  }, [proposals]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filterProposals = (filterValues = {}) => {
    let filteredProposals = proposals.filter((p) => {
      return (
        p.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.supervisor.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    for(let filter in filterValues){
      filteredProposals = filteredProposals.filter((p) => {
        if(filterValues[filter].length === 0) {
          return true; // If no filter is selected, return all proposals
        }
        for(let opt of filterValues[filter]) {
          if(p[filter].includes(opt)){
            return true;
          }
        }
        return false;
      });
    }

    setFilteredProposals(filteredProposals);
  };

  const getUniqueValues = (array) => [... new Set(array)];

  const filterValues = {
    "type": getUniqueValues(proposals.map(p => p.type.split(',').map(t => t.replace(/ /g, ""))).reduce((acc, val) => {
      acc.push(...val);
      return acc;
    }, [])),
    "groups": getUniqueValues(proposals.map(p => p.groups.split(',').map(t => t.replace(/ /g, ""))).reduce((acc, val) => {
      acc.push(...val);
      return acc;
    }, [])),
    "level": getUniqueValues(proposals.map(p => p.level)),
    "cds": getUniqueValues(proposals.map(p => p.cds)),
  }

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
        <ProposalFilters filters={filterValues} onChange={filterProposals} />
      </Toolbar>
      <ProposalTable data={filteredProposals} />
      <Box height={5} marginTop={3} />
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
      <Box height={5} marginTop={3} />
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
