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
import UserContext from "../contexts/UserContext";
import { DatePicker } from "@mui/x-date-pickers";

const TYPES = ["Research", "Company", "Experimental", "Abroad"];
const LEVELS = ["Bachelor Degree", "Master Degree"];

function ProposalForm(props) {
  const user = useContext(UserContext);
  const [teachers, setTeachers] = useState(
    props.teachers.map((teacher) => teacher.email)
  );
  const [availableGroups, setAvailableGroups] = useState([user.cod_group]);

  const [formData, setFormData] = useState({
    title: "",
    supervisor: user ? user.email : "",
    coSupervisors: [],
    externalCoSupervisor: "",
    expirationDate: null,
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

  // Handle input change
  const handleFormInputChange = (field, value) => {
    if (field === "coSupervisors") {
      getAvailableGroups(value);
    }
    const newFormData =
      field === "level" ? { [field]: value, cds: "" } : { [field]: value };
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newFormData,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

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

  // Get groups based on the selected co-supervisors
  const getAvailableGroups = (coSupervisors) => {
    const groups = coSupervisors.map((email) => {
      const teacher = props.teachers.find((teacher) => teacher.email === email);
      return teacher ? teacher.cod_group : null;
    });
    // Remove null values and duplicate groups
    const uniqueGroups = [...new Set(groups.filter(Boolean))];

    // If no co-supervisors selected, default to user's group
    const finalGroups =
      uniqueGroups.length === 0 ? [user.cod_group] : uniqueGroups;

    setAvailableGroups(finalGroups);
  };

  // Add external co-supervisor to co-supervisors array
  const addCoSupervisor = () => {
    const externalCoSup = formData.externalCoSupervisor.trim();

    if (externalCoSup && !validator.isEmail(externalCoSup)) {
      // Invalid input
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Invalid email address",
      }));
    } else if (formData.coSupervisors.includes(externalCoSup)) {
      // Co-supervisor already present
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Email address already added",
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
      errors.cds = "Please provide a cds programme";
    }
    if (validator.isEmpty(formData.description)) {
      errors.description = "Please provide a description";
    }
    if (validator.isEmpty(formData.requiredKnowledge)) {
      errors.requiredKnowledge = "Please provide required knowledge";
    }
    if (!validator.isEmpty(formData.keywords)) {
      const areKeywordsInvalid = formData.keywords
        .split("\n")
        .some((keyword) => !validator.isAscii(keyword.trim()));
      errors.keywords = areKeywordsInvalid ? "Invalid keywords" : "";
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
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={2}
          name="title"
          label="Title"
          margin="normal"
          value={formData.title}
          onChange={(event) =>
            handleFormInputChange("title", event.target.value)
          }
          error={!!formErrors.title}
          helperText={formErrors.title}
        />
      </FormControl>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ md: 2, xs: -1 }}
        sx={{ mt: { md: 2, xs: 1 } }}
      >
        {/* Supervisor field */}
        <FormControl fullWidth>
          <TextField
            name="supervisor"
            label="Supervisor"
            margin="normal"
            defaultValue={user.email}
            disabled
            helperText="Supervisor cannot be changed"
          />
        </FormControl>
        {/* Co-supervisors field */}
        <FormControl fullWidth>
          <Autocomplete
            multiple
            name="coSupervisors"
            options={teachers}
            value={formData.coSupervisors}
            onChange={(event, value) =>
              handleFormInputChange("coSupervisors", value)
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Co-supervisors"
                placeholder="Email"
                margin="normal"
              />
            )}
          />
        </FormControl>
      </Stack>

      {/* External co-supervisor */}
      <FormControl fullWidth>
        <Stack
          spacing={1}
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mt: { md: 2, xs: 3 } }}
        >
          <TextField
            fullWidth
            name="externalCoSupervisor"
            label="External co-supervisor"
            margin="normal"
            value={formData.externalCoSupervisor}
            onChange={(event) =>
              handleFormInputChange("externalCoSupervisor", event.target.value)
            }
            helperText={
              formErrors.externalCoSupervisor !== ""
                ? formErrors.externalCoSupervisor
                : "Enter an email address"
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
      <FormControl fullWidth sx={{ mt: 1 }}>
        <DatePicker
          slotProps={{
            textField: {
              color: "primary",
              margin: "normal",
              helperText: formErrors.expirationDate,
              error: !!formErrors.expirationDate,
            },
          }}
          value={
            formData.expirationDate ? dayjs(formData.expirationDate) : null
          }
          onChange={(newDate) =>
            handleFormInputChange(
              "expirationDate",
              dayjs(newDate).format("YYYY-MM-DD")
            )
          }
          disableFuture={false}
          disablePast
          format="MMMM D, YYYY"
          label="Expiration Date*"
        />
      </FormControl>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ xs: 0, md: 2 }}
        sx={{ mt: { md: 2, xs: 1 } }}
      >
        {/* Type field */}
        <FormControl fullWidth required error={!!formErrors.type}>
          <Autocomplete
            multiple
            name="type"
            options={TYPES}
            value={formData.type}
            onChange={(event, value) => handleFormInputChange("type", value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Type"
                placeholder="Type"
                margin="normal"
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
            options={availableGroups}
            value={formData.groups}
            onChange={(event, value) => handleFormInputChange("groups", value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Groups"
                placeholder="Group"
                margin="normal"
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
        spacing={{ xs: 0, md: 2 }}
        sx={{ mt: { md: 2, xs: 0 } }}
      >
        {/* Level field */}
        <FormControl fullWidth>
          <TextField
            required
            select
            name="level"
            label="Level"
            margin="normal"
            value={formData.level}
            onChange={(event) =>
              handleFormInputChange("level", event.target.value)
            }
            error={!!formErrors.level}
            helperText={formErrors.level}
          >
            {LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* CDS field */}
        <FormControl fullWidth>
          <TextField
            required
            select
            name="cds"
            label="CDS/Programmes"
            margin="normal"
            value={formData.cds}
            onChange={(event) =>
              handleFormInputChange("cds", event.target.value)
            }
            error={!!formErrors.cds}
            helperText={
              formErrors.cds !== ""
                ? formErrors.cds
                : "First select a degree level"
            }
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
        </FormControl>
      </Stack>

      {/* Keywords field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          multiline
          rows={3}
          name="keywords"
          label="Keywords"
          margin="normal"
          value={formData.keywords}
          onChange={(event) =>
            handleFormInputChange("keywords", event.target.value)
          }
          helperText={
            formErrors.keywords !== ""
              ? formErrors.keywords
              : "Write one keyword per line"
          }
          error={!!formErrors.keywords}
        />
      </FormControl>

      {/* Description field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={6}
          name="description"
          label="Description"
          margin="normal"
          value={formData.description}
          onChange={(event) =>
            handleFormInputChange("description", event.target.value)
          }
          error={!!formErrors.description}
          helperText={formErrors.description}
        />
      </FormControl>

      {/* Required knowledge field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={4}
          name="requiredKnowledge"
          label="Required knowledge"
          margin="normal"
          value={formData.requiredKnowledge}
          onChange={(event) =>
            handleFormInputChange("requiredKnowledge", event.target.value)
          }
          error={!!formErrors.requiredKnowledge}
          helperText={formErrors.requiredKnowledge}
        />
      </FormControl>

      {/* Notes field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          multiline
          rows={4}
          name="notes"
          label="Notes"
          margin="normal"
          value={formData.notes}
          onChange={(event) =>
            handleFormInputChange("notes", event.target.value)
          }
        />
      </FormControl>
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 4, mb: 2 }}>
        Create Proposal
      </Button>
    </Box>
  );
}

export default ProposalForm;
