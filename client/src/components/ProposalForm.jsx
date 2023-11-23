import { useContext, useState } from "react";
import dayjs from "dayjs";
import validator from "validator";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import UserContext from "../contexts/UserContext";
import { DatePicker } from "@mui/x-date-pickers";
import { LEVELS, TYPES } from "../utils/constants";

function ProposalForm(props) {
  const user = useContext(UserContext);
  const [teachers, setTeachers] = useState(
    props.teachers.map((teacher) => teacher.email)
  );

  const [formData, setFormData] = useState({
    title: "",
    supervisor: user ? user.email : "",
    coSupervisors: [],
    externalCoSupervisor: "",
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

  const [formErrors, setFormErrors] = useState({
    title: "",
    supervisor: "",
    coSupervisors: "",
    externalCoSupervisor: "",
    expirationDate: "",
    type: "",
    level: "",
    groups: "",
    description: "",
    requiredKnowledge: "",
    keywords: "",
    notes: "",
    cds: "",
  });

  // Filter degrees based on the selected level
  const getCdsOptions = () => {
    if (formData.level === "Master Degree") {
      return props.degrees.filter((degree) =>
        degree.cod_degree.startsWith("LM")
      );
    } else if (formData.level === "Bachelor Degree") {
      return props.degrees.filter(
        (degree) => !degree.cod_degree.startsWith("LM")
      );
    } else {
      return props.degrees;
    }
  };

  // Single input field
  const handleSingleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedFormData =
      name === "level" ? { [name]: value, cds: "" } : { [name]: value };

    setFormData((prevFormData) => ({
      ...prevFormData,
      ...updatedFormData,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Multiple input fields
  const handleAutocompleteChange = (fieldName) => (event, values, reason) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: values,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  // Add external co-supervisor to co-supervisors array
  const addCoSupervisor = () => {
    const externalCoSup = formData.externalCoSupervisor.trim();

    if (externalCoSup && !validator.isEmail(externalCoSup)) {
      // Invalid input
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Please provide a valid email address",
      }));
    } else {
      setTeachers([...teachers, externalCoSup]);
      // Update the co-supervisors
      setFormData((prevFormData) => ({
        ...prevFormData,
        coSupervisors: [...prevFormData.coSupervisors, externalCoSup],
        externalCoSupervisor: "", // Reset the input field
      }));
    }
  };

  // Date input field
  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      expirationDate: dayjs(date).format("YYYY-MM-DD"),
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
        co_supervisors: formData.coSupervisors,
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
          <Autocomplete
            multiple
            name="coSupervisors"
            options={teachers}
            getOptionLabel={(option) => option}
            value={formData.coSupervisors}
            onChange={(event, values, reason) =>
              handleAutocompleteChange("coSupervisors")(event, values, reason)
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Co-supervisors"
                placeholder="Email"
              />
            )}
          />
        </FormControl>
      </Stack>

      {/* External co-supervisor */}
      <FormControl fullWidth sx={{ mt: 4 }}>
        <Stack
          spacing={1}
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <TextField
            fullWidth
            name="externalCoSupervisor"
            label="External co-supervisor"
            margin="normal"
            value={formData.externalCoSupervisor}
            onChange={handleSingleInputChange}
            helperText={
              formErrors.externalCoSupervisor !== ""
                ? formErrors.externalCoSupervisor
                : "Enter one email address at a time"
            }
            error={!!formErrors.externalCoSupervisor}
          />
          <Button
            variant="outlined"
            sx={{ height: "56px" }}
            onClick={addCoSupervisor}
          >
            Add
          </Button>
        </Stack>
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
          <Autocomplete
            multiple
            name="type"
            options={TYPES}
            getOptionLabel={(option) => option}
            value={formData.type}
            onChange={(event, values, reason) =>
              handleAutocompleteChange("type")(event, values, reason)
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Type"
                placeholder="Type"
                error={!!formErrors.type}
              />
            )}
          />
          <FormHelperText>{formErrors.type}</FormHelperText>
        </FormControl>

        {/* Groups field */}
        <FormControl fullWidth required error={!!formErrors.groups}>
          <Autocomplete
            multiple
            name="groups"
            options={props.groups.map((group) => group.cod_group)}
            getOptionLabel={(group) => group}
            value={formData.groups}
            onChange={(event, values, reason) =>
              handleAutocompleteChange("groups")(event, values, reason)
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Groups"
                placeholder="Group"
                error={!!formErrors.groups}
              />
            )}
          />
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
          defaultValue={LEVELS[0]}
          value={formData.level}
          onChange={handleSingleInputChange}
          error={!!formErrors.level}
          helperText={formErrors.level}
        >
          {LEVELS.map((level) => (
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
          value={formData.cds}
          onChange={handleSingleInputChange}
          error={!!formErrors.cds}
          helperText={formErrors.cds}
          disabled={formData.level === ""}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxWidth: "400px",
                  whiteSpace: "nowrap",
                },
              },
            },
          }}
        >
          {getCdsOptions().map((degree) => (
            <MenuItem key={degree.cod_degree} value={degree.cod_degree}>
              {degree.cod_degree + " " + degree.title_degree}
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
