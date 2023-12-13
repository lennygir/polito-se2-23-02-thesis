import { useState } from "react";
import PropTypes from "prop-types";
import validator from "validator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BaseForm from "./BaseForm";

function RequestForm(props) {
  const { createRequest, teachers } = props;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    supervisor: null,
    coSupervisors: []
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    supervisor: ""
  });

  // Handle input change
  const handleFormInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ""
    }));
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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <BaseForm
        formData={formData}
        formErrors={formErrors}
        handleFormInputChange={handleFormInputChange}
        teachers={teachers}
      />
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 4, mb: 2 }}>
        Create Request
      </Button>
    </Box>
  );
}

RequestForm.propTypes = {
  createRequest: PropTypes.func,
  teachers: PropTypes.array
};

export default RequestForm;
