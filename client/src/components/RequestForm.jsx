import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import validator from "validator";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import UserContext from "../contexts/UserContext";
import { Tooltip } from "@mui/material";

function RequestForm(props) {
  const user = useContext(UserContext);
  const proposal = null;
  const filteredTeachers = props.teachers.map((teacher) => teacher.email);
  const [teachers, setTeachers] = useState(filteredTeachers);
  const [disableForm, setDisableForm] = useState(props.disableForm);
  const [formData, setFormData] = useState({
    title: "",
    supervisor: "",
    coSupervisors: [],
    description: ""
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    supervisor: "",
  });

  /** If a proposal is set, fill the form */
  // useEffect(() => {
  //   if (proposal) {
  //     setFormData({
  //       title: proposal.title,
  //       supervisor: proposal.supervisor,
  //       coSupervisors: proposal.co_supervisors.split(", "),
  //       description: proposal.description
  //     });
  //   }
  // }, [proposal]);

  useEffect(() => {
    setDisableForm(props.disableForm);
  }, [props.disableForm]);

  // Handle input change
  const handleFormInputChange = (field, value) => {
    const newFormData = { [field]: value };
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newFormData
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ""
    }));
  };

  /** Form validation */
  const validateForm = () => {
    const errors = {};
    if (validator.isEmpty(formData.title)) {
      errors.title = "Please provide a title";
    }
    if (validator.isEmpty(formData.description)) {
      errors.description = "Please provide a description";
    }
    if (formData.supervisor===null || validator.isEmpty(formData.supervisor)) {
      errors.supervisor = "Please choose a supervisor";
    }
    return errors;
  };

  /** Form Submit handler */
  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      // Set the errors in the form
      setFormErrors(errors);
      return;
    }
    const supervisorId = props.teachers.filter((teacher) => teacher.email !== formData.supervisor).map((teacher) => teacher.id);

    // Check for proposal with same title and description
    const dupedProposal = props.proposals.find(
      (proposal) => proposal.title === formData.title
    );
    if (dupedProposal) {
      props.setAlert({
        message: "Proposal with the same title and description already exists",
        severity: "warning"
      });
      return;
    }

    const data = {
      title: formData.title,
      description: formData.description,
      co_supervisors: formData.coSupervisors,
      supervisor: supervisorId,
    };
    if (props.mode === "create") {
      props.createRequest(data);
    }
  };

  const CustomPaper = (props) => {
    return <Paper elevation={8} sx={{ borderRadius: 3, paddingX: 1 }} {...props} />;
  };

  const ChipProps = { sx: { height: 26 } };

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
          onChange={(event) => handleFormInputChange("title", event.target.value)}
          error={!!formErrors.title}
          helperText={formErrors.title}
          disabled={disableForm}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          required
          multiline
          rows={6}
          name="description"
          label="Description"
          margin="normal"
          value={formData.description}
          onChange={(event) => handleFormInputChange("description", event.target.value)}
          error={!!formErrors.description}
          helperText={formErrors.description}
          disabled={disableForm}
          
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
          <Autocomplete
            name="supervisor"
            required
            options={[...teachers]}
            value={formData.supervisor}
            onChange={(event, value) => handleFormInputChange("supervisor", value)}
            // filterSelectedOptions
            PaperComponent={CustomPaper}
            ChipProps={ChipProps}
            disabled={disableForm}
            renderInput={(param) => (
              <TextField disabled={disableForm}
              error={!!formErrors.supervisor}
              helperText={formErrors.supervisor ? formErrors.supervisor : ''}
              {...param} label="supervisor" placeholder="Email" margin="normal"
              
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
            name="coSupervisors"
            options={[...teachers]}
            value={formData.coSupervisors}
            onChange={(event, value) => handleFormInputChange("coSupervisors", value)}
            filterSelectedOptions
            PaperComponent={CustomPaper}
            ChipProps={ChipProps}
            disabled={disableForm}
            renderInput={(params) => (
              <TextField  {...params} label="Co-supervisors" placeholder="Email" margin="normal" />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
          />
        </FormControl>
      </Stack>

      <Button fullWidth type="submit" variant="contained" sx={{ mt: 4, mb: 2 }} disabled={disableForm}>
        {disableForm  ? "Request waiting for approval" : "Create Request"}
      </Button>
    </Box>
  );
}

export default RequestForm;
