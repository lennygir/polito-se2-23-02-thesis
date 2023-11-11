import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import UserContext from "../contexts/UserContext";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const types = ["Research", "Company", "Experimental", "Abroad"];
const levels = ["Bachelor Degree", "Master Degree"];

const item_height = 48;
const item_padding_top = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: item_height * 4.5 + item_padding_top,
      width: 250,
    },
  },
};

function ProposalForm(props) {
  const user = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: "",
    supervisor: user ? user.email : "",
    coSupervisors: [],
    externalCoSupervisors: "",
    expirationDate: dayjs().format("YYYY-MM-DD"),
    type: [],
    level: "",
    groups: [],
    description: "",
    requiredKnowledge: "",
    keywords: "",
    notes: "",
    cds: "",
  });

  const handleSingleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      expirationDate: dayjs(date).format("YYYY-MM-DD"),
    }));
  };

  const handleMultipleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Title field */}
      <FormControl fullWidth>
        <TextField
          multiline
          rows={2}
          name="title"
          label="Title"
          margin="normal"
          value={formData.title}
          onChange={handleSingleInputChange}
        />
      </FormControl>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={2}
        marginTop={4}
      >
        {/* Supervisor field */}
        <TextField
          fullWidth
          name="supervisor"
          label="Supervisor"
          margin="normal"
          defaultValue={formData.supervisor}
          disabled
          helperText="Supervisor cannot be changed"
        />
        {/* Academic co-supervisors field */}
        <FormControl fullWidth>
          <InputLabel id="co-supervisors-label">Co-supervisors</InputLabel>
          <Select
            multiple
            labelId="co-supervisors-label"
            name="coSupervisors"
            value={formData.coSupervisors}
            onChange={handleMultipleInputChange}
            input={
              <OutlinedInput id="co-supervisors-chip" label="Co-supervisors" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {props.teachers.map((prof) => (
              <MenuItem key={prof} value={prof}>
                {prof}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* External co-supervisor */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          name="externalCoSupervisors"
          label="External co-supervisors"
          margin="normal"
          value={formData.externalCoSupervisors}
          onChange={handleSingleInputChange}
          helperText="Write one or more valid email addresses separated by comma"
        />
      </FormControl>

      {/* Expiration date field */}
      <Stack direction="row" alignItems="center" marginTop={{ xs: 1, md: 3 }}>
        <Typography variant="h7">Expiration&nbsp;date</Typography>
        <DatePicker
          slotProps={{ textField: { fullWidth: true, color: "primary" } }}
          sx={{ ml: 5 }}
          defaultValue={dayjs(formData.expirationDate)}
          value={dayjs(formData.expirationDate)}
          onChange={handleDateChange}
          disableFuture={false}
          disablePast
          format="DD/MM/YYYY"
        />
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ xs: 4, md: 2 }}
        marginTop={4}
      >
        {/* Type field */}
        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            multiple
            labelId="type-label"
            name="type"
            value={formData.type}
            onChange={handleMultipleInputChange}
            input={<OutlinedInput id="type-chip" label="Type" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Groups field */}
        <FormControl fullWidth>
          <InputLabel id="groups-label">Groups</InputLabel>
          <Select
            multiple
            labelId="groups-label"
            name="groups"
            value={formData.groups}
            onChange={handleMultipleInputChange}
            input={<OutlinedInput id="groups-chip" label="Groups" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {props.groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ xs: 4, md: 2 }}
        marginTop={4}
      >
        {/* Level field */}
        <TextField
          fullWidth
          select
          name="level"
          label="Level"
          margin="normal"
          defaultValue={levels[0]}
          value={formData.level}
          onChange={handleSingleInputChange}
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        {/* CDS field */}
        <TextField
          fullWidth
          select
          name="cds"
          label="CDS/Programmes"
          margin="normal"
          defaultValue={props.cds[0]}
          value={formData.cds}
          onChange={handleSingleInputChange}
        >
          {props.cds.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Keywords field */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          name="keywords"
          label="Keywords"
          margin="normal"
          value={formData.keywords}
          onChange={handleSingleInputChange}
          helperText="Write one or more keywords separated by comma"
        />
      </FormControl>

      {/* Description field */}
      <FormControl fullWidth id="description">
        <TextField
          multiline
          rows={6}
          id="description"
          name="description"
          label="Description"
          margin="normal"
          value={formData.description}
          onChange={handleSingleInputChange}
        />
      </FormControl>

      {/* Required knowledge field */}
      <FormControl fullWidth sx={{ mt: 1 }} id="required-knowledge">
        <TextField
          multiline
          rows={4}
          id="required-knowledge"
          name="requiredKnowledge"
          label="Required knowledge"
          margin="normal"
          value={formData.requiredKnowledge}
          onChange={handleSingleInputChange}
        />
      </FormControl>

      {/* Notes field */}
      <FormControl fullWidth sx={{ mt: 1 }} id="notes">
        <TextField
          multiline
          rows={4}
          id="notes"
          name="notes"
          label="Notes"
          margin="normal"
          value={formData.notes}
          onChange={handleSingleInputChange}
          helperText="* Optional"
        />
      </FormControl>
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Proposal
      </Button>
    </Box>
  );
}

export default ProposalForm;
