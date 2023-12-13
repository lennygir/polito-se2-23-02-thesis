import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import Hidden from "@mui/material/Hidden";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import ProposalFilters from "../components/ProposalFilters";
import ProposalTable from "../components/ProposalTable";
import ErrorContext from "../contexts/ErrorContext";
import UserContext from "../contexts/UserContext";
import { TEACHER_PROPOSALS_FILTERS, TEACHER_HEADERS_ACTIVE, TEACHER_HEADERS_EXPIRED } from "../utils/constants";
import API from "../utils/API";

function ProposalsPage(props) {
  const { setAlert, setDirty, currentDate, proposals, applications, teachers, groups, getTeacherById } = props;
  const user = useContext(UserContext);
  const { handleErrors } = useContext(ErrorContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterValues, setFilterValues] = useState({
    type: [],
    groups: [],
    startDate: null,
    endDate: null
  });
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState("active");

  const handleTeacherFilterChange = (selectedFilter) => {
    setSelectedTeacherFilter(selectedFilter);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const handleMenuInputChange = (filter, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [filter]: value
    }));
  };

  const resetMenuFilters = () => {
    setFilterValues({
      type: [],
      groups: [],
      startDate: null,
      endDate: null
    });
  };

  const filteredStudentProposals = proposals
    .filter((proposal) => {
      const { title, co_supervisors, keywords, description, required_knowledge, notes } = proposal;

      // Convert supervisor ID to name
      const supervisor = teachers.find((teacher) => teacher.id === proposal.supervisor);
      const supervisorName = supervisor?.name || "";
      const supervisorSurname = supervisor?.surname || "";

      // Check if any field contains the search input
      const searchFields = [
        title,
        supervisorName,
        supervisorSurname,
        co_supervisors,
        keywords,
        description,
        required_knowledge,
        notes || ""
      ];

      return searchFields.some((field) => {
        if (field !== null && field !== undefined) {
          return field.toLowerCase().includes(searchInput.toLowerCase());
        }
        return false;
      });
    })
    .filter((proposal) => {
      // Apply additional filters based on filterValues
      const { type, groups, startDate, endDate } = filterValues;

      // Check if proposal matches the filter values
      const proposalTypeArray = proposal.type.split(",").map((type) => type.trim());
      const proposalGroupsArray = proposal.groups.split(",").map((group) => group.trim());

      const typeMatch = type.length === 0 || proposalTypeArray.some((t) => type.includes(t));
      const groupsMatch = groups.length === 0 || proposalGroupsArray.some((g) => groups.includes(g));
      const expirationDate = dayjs(proposal.expiration_date);
      let isExpirationDateInRange = true;
      if (startDate !== null && endDate !== null) {
        isExpirationDateInRange =
          (expirationDate.isAfter(dayjs(startDate)) || expirationDate.isSame(dayjs(startDate))) &&
          (expirationDate.isBefore(dayjs(endDate)) || expirationDate.isSame(dayjs(endDate)));
      }
      return typeMatch && groupsMatch && isExpirationDateInRange;
    });

  const studentView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          Theses Proposals
        </Typography>
        <Hidden smDown>
          <Button component={Link} to="/add-request" variant="contained" sx={{ mr: 4 }} startIcon={<AddIcon />}>
            New Request
          </Button>
        </Hidden>
      </Stack>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: 96,
          marginTop: { md: -2, xs: 0 },
          marginX: { md: 1, xs: -2 }
        }}
      >
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: 2,
            paddingRight: 3,
            borderRadius: 4
          }}
        >
          <OutlinedInput
            sx={{ borderRadius: 4, width: { md: "400px", xs: "200px" } }}
            placeholder="Search proposal..."
            onChange={(e) => handleSearchInputChange(e.target.value)}
            value={searchInput}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.disabled", width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          <ProposalFilters
            groups={groups}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            filterValues={filterValues}
            handleMenuInputChange={handleMenuInputChange}
            resetMenuFilters={resetMenuFilters}
          />
        </Card>
      </Toolbar>
      <ProposalTable data={filteredStudentProposals} getTeacherById={getTeacherById} applications={applications} />
      <Box height={5} marginTop={3} />
      <Hidden smUp>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <Fab component={Link} to="/add-request" aria-label="Add" color="primary">
            <AddIcon />
          </Fab>
        </Stack>
      </Hidden>
    </>
  );

  const filteredTeacherProposals = proposals.filter((proposal) => {
    if (selectedTeacherFilter === "active") {
      return !proposal.archived;
    }
    if (selectedTeacherFilter === "archive") {
      return proposal.archived;
    }
    return true;
  });

  const archiveProposal = (proposalId) => {
    API.archiveProposal(proposalId)
      .then(() => {
        setAlert({
          message: "Proposal archived successfully",
          severity: "success"
        });
        setDirty(true);
      })
      .catch((err) => handleErrors(err));
  };

  const deleteProposal = (proposalId) => {
    API.deleteProposal(proposalId)
      .then(() => {
        setAlert({
          message: "Proposal deleted successfully",
          severity: "success"
        });
        setDirty(true);
      })
      .catch((err) => handleErrors(err));
  };

  const teacherView = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ paddingY: { md: 4, xs: 2 }, marginLeft: { md: 4, xs: 0 } }}>
          My Thesis Proposals
        </Typography>
        <Hidden smDown>
          <Button component={Link} to="/add-proposal" variant="contained" sx={{ mr: 4 }} startIcon={<AddIcon />}>
            New Proposal
          </Button>
        </Hidden>
      </Stack>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginX: { md: 3, xs: 0 },
          marginY: { md: -2, xs: 0 }
        }}
      >
        <Stack direction="row" spacing={1}>
          {TEACHER_PROPOSALS_FILTERS.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              variant={selectedTeacherFilter === filter.id ? "filled" : "outlined"}
              onClick={() => handleTeacherFilterChange(filter.id)}
              sx={{ height: 30 }}
            />
          ))}
        </Stack>
      </Toolbar>
      <ProposalTable
        headers={selectedTeacherFilter === "active" ? TEACHER_HEADERS_ACTIVE : TEACHER_HEADERS_EXPIRED}
        data={filteredTeacherProposals}
        deleteProposal={deleteProposal}
        archiveProposal={archiveProposal}
        teacherFilter={selectedTeacherFilter}
        applications={applications}
        currentDate={currentDate}
      />
      <Box height={5} marginTop={3} />
      <Hidden smUp>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <Fab component={Link} to="/add-proposal" aria-label="Add" color="primary">
            <AddIcon />
          </Fab>
        </Stack>
      </Hidden>
    </>
  );

  return <div id="proposals-page">{user?.role === "student" ? studentView : teacherView}</div>;
}

ProposalsPage.propTypes = {
  setAlert: PropTypes.func,
  setDirty: PropTypes.func,
  currentDate: PropTypes.string,
  proposals: PropTypes.array,
  applications: PropTypes.array,
  teachers: PropTypes.array,
  groups: PropTypes.array,
  getTeacherById: PropTypes.func
};

export default ProposalsPage;
