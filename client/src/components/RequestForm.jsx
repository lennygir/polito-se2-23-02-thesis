import { useState } from "react";
import PropTypes from "prop-types";
import validator from "validator";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CustomPaper from "./CustomPaper";

function RequestForm(props) {
  const { createRequest, teachers, getTeacherById, proposal } = props;

  const supervisor = proposal ? getTeacherById(proposal.supervisor) : null;

  const [formData, setFormData] = useState({
    title: proposal ? proposal.title : "",
    description: proposal ? proposal.description : "",
    supervisor: supervisor.email,
    coSupervisors: proposal ? proposal.co_supervisors.split(", ") : []
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    supervisor: ""
  });

  // Handle input change
  const handleFormInputChange = (field, value) => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ""
    }));

    if (field === "supervisor" && formData.coSupervisors.includes(value)) {
      // If the selected supervisor is in the coSupervisors list, remove it from the ladder
      setFormData((prevFormData) => ({
        ...prevFormData,
        supervisor: value,
        coSupervisors: prevFormData.coSupervisors.filter((coSupervisor) => coSupervisor !== value)
      }));
    } else if (field === "coSupervisors" && value.includes(formData.supervisor)) {
      // If a co-supervisor is being selected, remove the supervisor with the same email
      setFormData((prevFormData) => ({
        ...prevFormData,
        supervisor: null,
        coSupervisors: value
      }));
    } else {
      // Otherwise, update the form data as usual
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (validator.isEmpty(formData.title)) {
      errors.title = "Please provide a title";
    }
    if (validator.isEmpty(formData.description)) {
      errors.description = "Please provide a description";
    }
    if (!formData.supervisor || validator.isEmpty(formData.supervisor)) {
      errors.supervisor = "Please choose a supervisor";
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    const supervisor = teachers.find((teacher) => teacher.email === formData.supervisor);

    const data = {
      title: formData.title,
      description: formData.description,
      supervisor: supervisor.id,
      co_supervisors: formData.coSupervisors
    };
    createRequest(data);
  };

  const ChipProps = { sx: { height: 26 } };

  return (
    <Box name="request-form" component="form" onSubmit={handleSubmit} noValidate>
      {/* Title field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={2}
          name="request-title"
          label="Thesis title"
          margin="normal"
          value={formData.title}
          onChange={(event) => handleFormInputChange("title", event.target.value)}
          error={!!formErrors.title}
          helperText={formErrors.title}
        />
      </FormControl>

      {/* Description field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={6}
          name="request-description"
          label="Thesis description"
          margin="normal"
          value={formData.description}
          onChange={(event) => handleFormInputChange("description", event.target.value)}
          error={!!formErrors.description}
          helperText={formErrors.description}
        />
      </FormControl>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ md: 2, xs: -1 }}
        sx={{ mt: { md: 2, xs: 1 } }}
      >
        {/* Supervisor field */}
        <FormControl fullWidth error={!!formErrors.supervisor}>
          <Autocomplete
            name="request-supervisor"
            required
            options={teachers.map((teacher) => teacher.email)}
            value={formData.supervisor}
            onChange={(event, value) => handleFormInputChange("supervisor", value)}
            PaperComponent={CustomPaper}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Supervisor"
                placeholder="Supervisor"
                margin="normal"
                error={!!formErrors.supervisor}
                helperText={formErrors.supervisor ? formErrors.supervisor : ""}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
          />
        </FormControl>
        {/* Co-supervisors field */}
        <FormControl fullWidth>
          <Autocomplete
            multiple
            name="request-coSupervisors"
            options={teachers.map((teacher) => teacher.email)}
            value={formData.coSupervisors}
            onChange={(event, value) => handleFormInputChange("coSupervisors", value)}
            ChipProps={ChipProps}
            PaperComponent={CustomPaper}
            renderInput={(params) => (
              <TextField {...params} label="Co-supervisors" placeholder="Email" margin="normal" />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
            filterSelectedOptions
          />
        </FormControl>
      </Stack>
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 4, mb: 2 }}>
        Create Request
      </Button>
    </Box>
  );
}

RequestForm.propTypes = {
  createRequest: PropTypes.func,
  teachers: PropTypes.array,
  getTeacherById: PropTypes.func,
  proposal: PropTypes.object
};

export default RequestForm;
