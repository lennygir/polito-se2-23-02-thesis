import { useState } from "react";
import Divider from "@mui/material/Divider";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
            height: "100vh",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" sx={{ py: 2 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ mt: 2 }}>
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
          </Box>
          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ my: 1, height: "50px", borderRadius: 4 }}
              onClick={resetFilters}
              endIcon={<FilterAltOffIcon />}
            >
              Clear filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default ProposalFilters;
