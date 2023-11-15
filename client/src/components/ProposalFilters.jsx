import { useState } from "react";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FilterListIcon from "@mui/icons-material/FilterList";

function ProposalFilters(props) {
  const [isOpen, setIsOpen] = useState(false);

  const filterValues = props.filters;
  const onChange = props.onChange;
  const initialValues = {};
  Object.keys(filterValues).forEach((filter) => (initialValues[filter] = []));
  const [values, setValues] = useState(initialValues);

  const handleChange = (filter, value) => {
    const newValue = { ...values };
    newValue[filter] = value;
    setValues(newValue);
    onChange(newValue);
  };

  const resetFilters = () => {
    setValues(initialValues);
    onChange(initialValues);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={toggleDrawer}
        endIcon={<FilterListIcon />}
      >
        Filters&nbsp;
      </Button>
      <Drawer
        anchor="right"
        PaperProps={{ sx: { width: "300px", padding: "20px" } }}
        open={isOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filterValues &&
            Object.keys(filterValues).map((filter) => (
              <FormControl key={filter} fullWidth sx={{ my: 1 }}>
                <Autocomplete
                  multiple
                  name={filter}
                  options={filterValues[filter]}
                  onChange={(event, value) => handleChange(filter, value)}
                  value={values[filter]}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={filter}
                      placeholder={filter}
                    />
                  )}
                />
              </FormControl>
            ))}
          <Button
            variant="contained"
            sx={{ my: 1 }}
            onClick={resetFilters}
            endIcon={<FilterAltOffIcon />}
          >
            Reset filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default ProposalFilters;
