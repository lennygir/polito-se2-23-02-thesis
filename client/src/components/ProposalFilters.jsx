import { useState } from "react";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function ProposalFilters(props) {

  const [isOpen, setIsOpen] = useState(false);
  
  const filterValues = props.filters;
  const onChange = props.onChange;
  const initialValues = {};
  Object.keys(filterValues).forEach(filter => initialValues[filter] = []);
  const [values, setValues] = useState(initialValues);

  const handleChange = (filter, value) => {
    const newValue = {...values};
    newValue[filter] = value;
    setValues(newValue);
    onChange(newValue);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer} endIcon={<FilterListIcon />}>
        Filters&nbsp;
      </Button>
      <Drawer anchor="right" PaperProps={{ sx: { width: "300px", padding: "20px" } }} open={isOpen} onClose={toggleDrawer}>
        <Box>
          { filterValues && Object.keys(filterValues).map((filter) => (
            <FormControl key={filter} fullWidth sx={{ my: 1 }}>
              <Autocomplete
                multiple
                name={filter}
                options={filterValues[filter]}
                onChange={(event, value) => handleChange(filter, value)}
                value={values[filter]}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label={filter} placeholder={filter} />
                )}
              />
            </FormControl>
            ))
          }
        </Box>
      </Drawer>
    </>
  );
}

export default ProposalFilters;
