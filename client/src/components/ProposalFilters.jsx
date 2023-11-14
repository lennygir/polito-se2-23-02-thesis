import { useState } from "react";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ProposalFilters(props) {

  const [isOpen, setIsOpen] = useState(false);
  
  const filterValues = props.filters;
  const onChange = props.onChange;
  const initialValues = {};
  Object.keys(filterValues).forEach(filter => initialValues[filter] = []);
  const [values, setValues] = useState(initialValues);

  const handleChange = (filter) => {
    return (event) => {
      const newValue = {...values};
      newValue[filter] = event.target.value;
      setValues(newValue);
      onChange(newValue);
    };
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
            <FormControl key={filter} sx={{ my: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-label">{ filter }</InputLabel>
              <Select value={values[filter]} label="Type" onChange={handleChange(filter)} multiple>
                { filterValues && filterValues[filter].map((value) => (
                    <MenuItem key={value} value={value}>{ value }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            ))
          }
        </Box>
      </Drawer>
    </>
  );
}

export default ProposalFilters;
