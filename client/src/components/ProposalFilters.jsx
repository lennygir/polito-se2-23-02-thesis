import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

function ProposalFilters() {
  return (
    <>
      <Button variant="contained" endIcon={<FilterListIcon />}>
        Filters&nbsp;
      </Button>
    </>
  );
}

export default ProposalFilters;
