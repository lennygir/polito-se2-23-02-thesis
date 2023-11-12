import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
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
import validator from "validator";

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

  const [formErrors, setFormErrors] = useState({});

  // Single input field
  const handleSingleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Date input field
  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      expirationDate: dayjs(date).format("YYYY-MM-DD"),
    }));
  };

  // Multiple input field
  const handleMultipleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (validator.isEmpty(formData.title)) {
      errors.title = "Please provide a title";
    }
    if (!validator.isDate(formData.expirationDate)) {
      errors.expirationDate = "Please provide an expiration date";
    }
    if (formData.type.length === 0) {
      errors.type = "Please provide at least one type";
    }
    if (formData.groups.length === 0) {
      errors.groups = "Please provide at least one group";
    }
    if (validator.isEmpty(formData.level)) {
      errors.level = "Please provide a level";
    }
    if (validator.isEmpty(formData.cds)) {
      errors.cds = "Please provide a cds";
    }
    if (validator.isEmpty(formData.description)) {
      errors.description = "Please provide a description";
    }
    if (validator.isEmpty(formData.requiredKnowledge)) {
      errors.requiredKnowledge =
        "Please provide the required knowledge for this proposal";
    }
    if (!validator.isEmpty(formData.externalCoSupervisors)) {
      const externalCoSupervisorsArray = formData.externalCoSupervisors
        .split("\n")
        .map((email) => email.trim());
      let invalidCount = 0;
      const validExternalCoSupervisors = externalCoSupervisorsArray.filter(
        (email) => {
          if (!validator.isEmail(email)) {
            invalidCount++;
            return false;
          }
          return true;
        }
      );
      if (invalidCount > 0) {
        errors.externalCoSupervisors = "Please insert valid email addresses";
      }
    }
    if (!validator.isEmpty(formData.keywords)) {
      const keywordsArray = formData.keywords
        .split("\n")
        .map((keyword) => keyword.trim());
      let invalidCount = 0;
      const validKeywords = keywordsArray.filter((keyword) => {
        if (!validator.isAscii(keyword)) {
          invalidCount++;
          return false;
        }
        return true;
      });
      if (invalidCount > 0) {
        errors.keywords = "Please insert only letters or numbers";
      }
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      // Set the errors in the form
      setFormErrors(errors);
      return;
    } else {
      // Parse data and send the form
      const data = {
        title: formData.title,
        supervisor: user.id,
        co_supervisors: formData.coSupervisors.concat(
          formData.externalCoSupervisors
            .split("\n")
            .map((email) => email.trim())
        ),
        groups: formData.groups,
        keywords: formData.keywords
          .split("\n")
          .map((keyword) => keyword.trim()),
        types: formData.type,
        description: formData.description,
        required_knowledge: formData.requiredKnowledge,
        notes: formData.notes,
        expiration_date: formData.expirationDate,
        level: formData.level === "Bachelor Degree" ? "BSC" : "MSC",
        cds: formData.cds,
      };
      props.createProposal(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Title field */}
      <FormControl fullWidth>
        <TextField
          required
          multiline
          rows={2}
          name="title"
          label="Title"
          margin="normal"
          value={formData.title}
          onChange={handleSingleInputChange}
          error={!!formErrors.title}
          helperText={formErrors.title}
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
        {/* Co-supervisors field */}
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
          multiline
          rows={3}
          name="externalCoSupervisors"
          label="External co-supervisors"
          margin="normal"
          value={formData.externalCoSupervisors}
          onChange={handleSingleInputChange}
          helperText={
            formErrors.externalCoSupervisors !== ""
              ? formErrors.externalCoSupervisors
              : "Enter one email address per line"
          }
          error={!!formErrors.externalCoSupervisors}
        />
      </FormControl>

      {/* Expiration date field */}
      <Stack direction="row" alignItems="center" marginTop={{ xs: 1, md: 3 }}>
        <Typography variant="h7">Expiration&nbsp;date</Typography>
        <DatePicker
          slotProps={{
            textField: {
              fullWidth: true,
              color: "primary",
              helperText: formErrors.expirationDate,
            },
          }}
          sx={{ ml: 5 }}
          defaultValue={dayjs(formData.expirationDate)}
          value={dayjs(formData.expirationDate)}
          onChange={handleDateChange}
          onError={(error) =>
            setFormErrors((prevFormErrors) => ({
              ...prevFormErrors,
              expirationDate: "Please provide a valid date",
            }))
          }
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
        <FormControl fullWidth required error={!!formErrors.type}>
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
          <FormHelperText>{formErrors.type}</FormHelperText>
        </FormControl>

        {/* Groups field */}
        <FormControl fullWidth required error={!!formErrors.groups}>
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
          <FormHelperText>{formErrors.groups}</FormHelperText>
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
          required
          fullWidth
          select
          name="level"
          label="Level"
          margin="normal"
          defaultValue={levels[0]}
          value={formData.level}
          onChange={handleSingleInputChange}
          error={!!formErrors.level}
          helperText={formErrors.level}
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        {/* CDS field */}
        <TextField
          required
          fullWidth
          select
          name="cds"
          label="CDS/Programmes"
          margin="normal"
          defaultValue={props.cds[0]}
          value={formData.cds}
          onChange={handleSingleInputChange}
          error={!!formErrors.cds}
          helperText={formErrors.cds}
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
          multiline
          rows={3}
          name="keywords"
          label="Keywords"
          margin="normal"
          value={formData.keywords}
          onChange={handleSingleInputChange}
          helperText={
            formErrors.keywords !== ""
              ? formErrors.keywords
              : "Write one keyword per line"
          }
          error={!!formErrors.keywords}
        />
      </FormControl>

      {/* Description field */}
      <FormControl fullWidth id="description">
        <TextField
          required
          multiline
          rows={6}
          id="description"
          name="description"
          label="Description"
          margin="normal"
          value={formData.description}
          onChange={handleSingleInputChange}
          error={!!formErrors.description}
          helperText={formErrors.description}
        />
      </FormControl>

      {/* Required knowledge field */}
      <FormControl fullWidth sx={{ mt: 1 }} id="required-knowledge">
        <TextField
          required
          multiline
          rows={4}
          id="required-knowledge"
          name="requiredKnowledge"
          label="Required knowledge"
          margin="normal"
          value={formData.requiredKnowledge}
          onChange={handleSingleInputChange}
          error={!!formErrors.requiredKnowledge}
          helperText={formErrors.requiredKnowledge}
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
        />
      </FormControl>
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Proposal
      </Button>
    </Box>
  );
}

export default ProposalForm;
