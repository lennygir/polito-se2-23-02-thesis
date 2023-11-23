import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers";
import { TYPES } from "../utils/constants";

function ProposalFilters(props) {
  const {
    groups,
    degrees,
    isDrawerOpen,
    toggleDrawer,
    filterValues,
    handleMenuInputChange,
    resetMenuFilters,
  } = props;

  // Filter degrees based on the selected level
  const getCdsOptions = () => {
    if (filterValues.level === "MSC") {
      return degrees.filter((degree) => degree.cod_degree.startsWith("LM"));
    } else if (filterValues.level === "BCS") {
      return degrees.filter((degree) => !degree.cod_degree.startsWith("LM"));
    } else {
      return degrees;
    }
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
        open={isDrawerOpen}
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
            <IconButton onClick={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ my: 1 }}>
              <Autocomplete
                size="small"
                multiple
                options={TYPES}
                value={filterValues.type}
                onChange={(event, value) =>
                  handleMenuInputChange("type", value)
                }
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label="Type" placeholder="Type" />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1, mb: 3 }}>
              <Autocomplete
                size="small"
                multiple
                options={groups.map((group) => group.cod_group)}
                value={filterValues.groups}
                onChange={(event, value) =>
                  handleMenuInputChange("groups", value)
                }
                renderInput={(params) => (
                  <TextField {...params} label="Groups" placeholder="Groups" />
                )}
              />
            </FormControl>
            <Divider />
            <FormControl fullWidth sx={{ mt: 2, ml: 1 }}>
              <RadioGroup
                name="level"
                value={filterValues.level}
                onChange={(e) => handleMenuInputChange("level", e.target.value)}
              >
                <FormControlLabel
                  value="BCS"
                  control={<Radio />}
                  label={"Bachelor Degree"}
                />
                <FormControlLabel
                  value="MSC"
                  control={<Radio />}
                  label={"Master Degree"}
                />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1, mb: 3 }}>
              <TextField
                size="small"
                select
                label="CDS/Programme"
                value={filterValues.cds}
                onChange={(event) =>
                  handleMenuInputChange("cds", event.target.value)
                }
                disabled={filterValues.level === ""}
              >
                {getCdsOptions().map((degree) => (
                  <MenuItem key={degree.cod_degree} value={degree.cod_degree}>
                    {degree.cod_degree + " " + degree.title_degree}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText>First select a degree level</FormHelperText>
            </FormControl>
            <Divider />
            <FormControl fullWidth sx={{ my: 3 }}>
              <Stack spacing={2}>
                <Typography variant="body">Expiration date from:</Typography>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="Start Date"
                  value={
                    filterValues.startDate
                      ? dayjs(filterValues.startDate)
                      : null
                  }
                  onChange={(newValue) =>
                    handleMenuInputChange(
                      "startDate",
                      dayjs(newValue).format("YYYY-MM-DD")
                    )
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                    },
                  }}
                />
                <Divider variant="middle">to</Divider>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="End Date"
                  value={
                    filterValues.endDate ? dayjs(filterValues.endDate) : null
                  }
                  onChange={(newValue) =>
                    handleMenuInputChange(
                      "endDate",
                      dayjs(newValue).format("YYYY-MM-DD")
                    )
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                    },
                  }}
                />
              </Stack>
            </FormControl>
          </Box>
          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ my: 1 }}
              onClick={resetMenuFilters}
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
