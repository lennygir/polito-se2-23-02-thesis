import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import validator from "validator";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import UserContext from "../contexts/UserContext";
import { DatePicker } from "@mui/x-date-pickers";
import { LEVELS, TYPES } from "../utils/constants";
import CustomPaper from "./CustomPaper";

function ProposalForm(props) {
  const user = useContext(UserContext);
  const { mode, proposal, teachersList, degrees, proposals, createProposal, editProposal, setAlert, currentDate } =
    props;

  const filteredTeachers = teachersList.filter((teacher) => teacher.id !== user.id).map((teacher) => teacher.email);

  const [teachers, setTeachers] = useState(filteredTeachers);
  const [groupOptions, setGroupOptions] = useState([user.cod_group]);
  const [formData, setFormData] = useState({
    title: "",
    supervisor: user.id,
    coSupervisors: [],
    externalCoSupervisor: "",
    expirationDate: null,
    type: [],
    groups: [user.cod_group],
    level: null,
    cds: null,
    description: "",
    requiredKnowledge: "",
    keywords: "",
    notes: ""
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
    cds: ""
  });

  const getCdsFormatted = (cds) => {
    const degree = degrees.find((degree) => degree.cod_degree === cds);
    if (degree) {
      return `${degree.cod_degree} ${degree.title_degree}`;
    } else {
      return null;
    }
  };

  /** If a proposal is set, fill the form */
  useEffect(() => {
    if (proposal) {
      getAvailableGroups(proposal.co_supervisors.split(", "));
      setFormData({
        title: proposal.title,
        supervisor: user.email,
        coSupervisors: proposal.co_supervisors.split(", "),
        externalCoSupervisor: "",
        expirationDate: proposal.expiration_date,
        type: proposal.type.split(", "),
        level: proposal.level === "MSC" ? "Master Degree" : proposal.level === "BCS" ? "Bachelor Degree" : "",
        groups: proposal.groups.split(", "),
        description: proposal.description,
        requiredKnowledge: proposal.required_knowledge === null ? "" : proposal.required_knowledge,
        keywords: proposal.keywords.replace(/, /g, "\n"),
        notes: proposal.notes === null ? "" : proposal.notes,
        cds: getCdsFormatted(proposal.cds)
      });
    }
  }, [proposal]);

  // Handle input change
  const handleFormInputChange = (field, value) => {
    if (field === "coSupervisors") {
      getAvailableGroups(value);
    }
    const newFormData = field === "level" ? { [field]: value, cds: null } : { [field]: value };
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newFormData
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ""
    }));
  };

  // Filter degrees based on the selected level
  const getCdsOptions = () => {
    if (formData.level === "Master Degree") {
      return degrees.filter((degree) => degree.cod_degree.startsWith("LM"));
    } else if (formData.level === "Bachelor Degree") {
      return degrees.filter((degree) => !degree.cod_degree.startsWith("LM"));
    } else {
      return degrees;
    }
  };

  // Get groups based on the selected co-supervisors
  const getAvailableGroups = (coSupervisors) => {
    const supervisorGroup = user.cod_group;
    const selectedCoSupervisorsGroups = coSupervisors.map((email) => {
      const coSupervisor = teachersList.find((teacher) => teacher.email === email);
      return coSupervisor ? coSupervisor.cod_group : null;
    });
    // Remove null values and duplicate groups
    const uniqueGroups = [...new Set(selectedCoSupervisorsGroups.filter(Boolean))];

    // If no co-supervisors selected, default to user's group
    const finalGroups = uniqueGroups.includes(supervisorGroup) ? uniqueGroups : [supervisorGroup, ...uniqueGroups];
    setGroupOptions(finalGroups);
  };

  // Add external co-supervisor to co-supervisors array
  const addCoSupervisor = () => {
    const externalCoSup = formData.externalCoSupervisor.trim();

    if (validator.isEmpty(externalCoSup)) {
      // Invalid input
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Enter an email address"
      }));
    } else if (externalCoSup && !validator.isEmail(externalCoSup)) {
      // Invalid input
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Invalid email address"
      }));
    } else if (formData.coSupervisors.includes(externalCoSup)) {
      // Co-supervisor already present
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        externalCoSupervisor: "Email address already added"
      }));
    } else {
      setTeachers([...teachers, externalCoSup]);
      // Update the co-supervisors
      setFormData((prevFormData) => ({
        ...prevFormData,
        coSupervisors: [...prevFormData.coSupervisors, externalCoSup],
        externalCoSupervisor: "" // Reset the input field
      }));
    }
  };

  /** Form validation */
  const validateForm = () => {
    const errors = {};

    if (validator.isEmpty(formData.title)) {
      errors.title = "Please provide a title";
    }
    if (!formData.expirationDate || !validator.isDate(formData.expirationDate)) {
      errors.expirationDate = "Please provide an expiration date";
    }
    if (!formData.type || formData.type.length === 0) {
      errors.type = "Please provide at least one type";
    }
    if (!formData.type || formData.groups.length === 0) {
      errors.groups = "Please provide at least one group";
    }
    if (!formData.level || validator.isEmpty(formData.level)) {
      errors.level = "Please provide a level";
    }
    if (!formData.cds || validator.isEmpty(formData.cds)) {
      errors.cds = "Please provide a cds programme";
    }
    if (validator.isEmpty(formData.description)) {
      errors.description = "Please provide a description";
    }
    if (validator.isEmpty(formData.requiredKnowledge)) {
      errors.requiredKnowledge = "Please provide required knowledge";
    }
    if (!validator.isEmpty(formData.keywords)) {
      const areKeywordsInvalid = formData.keywords.split("\n").some((keyword) => !validator.isAscii(keyword.trim()));
      errors.keywords = areKeywordsInvalid ? "Invalid keywords" : "";
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

    if (mode === "create") {
      // Check for proposal with same title and description
      const dupedProposal = proposals.find(
        (proposal) => proposal.title === formData.title && proposal.description === formData.description
      );
      if (dupedProposal) {
        setAlert({
          message: "Proposal with the same title and description already exists",
          severity: "warning"
        });
        return;
      }
    }

    const data = {
      title: formData.title,
      co_supervisors: formData.coSupervisors,
      groups: formData.groups,
      keywords: formData.keywords === "" ? null : formData.keywords.split("\n").map((keyword) => keyword.trim()),
      types: formData.type,
      description: formData.description,
      required_knowledge: formData.requiredKnowledge,
      notes: formData.notes === "" ? null : formData.notes,
      expiration_date: formData.expirationDate,
      level: formData.level === "Bachelor Degree" ? "BSC" : "MSC",
      cds: formData.cds.split(" ")[0]
    };
    if (mode === "update") {
      data.id = proposal.id;
      editProposal(data);
    } else if (mode === "create") {
      createProposal(data);
    }
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
          onChange={(event) => handleFormInputChange("description", event.target.value)}
          error={!!formErrors.description}
          helperText={formErrors.description}
        />
      </FormControl>

      {/* Expiration date field */}
      <FormControl fullWidth sx={{ mt: 1 }}>
        <DatePicker
          slotProps={{
            textField: {
              color: "primary",
              margin: "normal",
              helperText: formErrors.expirationDate !== "" ? formErrors.expirationDate : "",
              error: !!formErrors.expirationDate
            },
            desktopPaper: { sx: { borderRadius: 4 } }
          }}
          value={formData.expirationDate ? dayjs(formData.expirationDate) : null}
          onChange={(newDate) => handleFormInputChange("expirationDate", dayjs(newDate).format("YYYY-MM-DD"))}
          minDate={dayjs(currentDate)}
          disableFuture={false}
          disablePast
          format="MMMM D, YYYY"
          label="Expiration Date*"
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
            options={[...formData.coSupervisors, ...teachers]}
            value={formData.coSupervisors}
            onChange={(event, value) => handleFormInputChange("coSupervisors", value)}
            filterSelectedOptions
            PaperComponent={CustomPaper}
            ChipProps={ChipProps}
            renderInput={(params) => (
              <TextField {...params} label="Co-supervisors" placeholder="Email" margin="normal" />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
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
            onChange={(event) => handleFormInputChange("externalCoSupervisor", event.target.value)}
            helperText={
              formErrors.externalCoSupervisor !== "" ? formErrors.externalCoSupervisor : "Enter an email address"
            }
            error={!!formErrors.externalCoSupervisor}
          />
          <Tooltip title="Add to co-supervisors">
            <Button variant="contained" sx={{ height: "56px" }} onClick={addCoSupervisor}>
              Add
            </Button>
          </Tooltip>
        </Stack>
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
            PaperComponent={CustomPaper}
            ChipProps={ChipProps}
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
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
          />
          <FormHelperText>{formErrors.type}</FormHelperText>
        </FormControl>

        {/* Groups field */}
        <FormControl fullWidth required error={!!formErrors.groups}>
          <Autocomplete
            multiple
            name="groups"
            options={groupOptions}
            value={formData.groups}
            onChange={(event, value) => handleFormInputChange("groups", value)}
            filterSelectedOptions
            PaperComponent={CustomPaper}
            ChipProps={ChipProps}
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
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
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
          <Autocomplete
            name="level"
            options={LEVELS}
            value={formData.level}
            onChange={(event, value) => handleFormInputChange("level", value)}
            PaperComponent={CustomPaper}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Level"
                placeholder="Level"
                margin="normal"
                error={!!formErrors.level}
                helperText={formErrors.level !== "" ? formErrors.level : ""}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
          />
        </FormControl>

        {/* CDS field */}
        <FormControl fullWidth>
          <Autocomplete
            name="cds"
            disabled={!formData.level}
            options={getCdsOptions().map((degree) => `${degree.cod_degree} ${degree.title_degree}`)}
            value={formData.cds}
            onChange={(event, value) => handleFormInputChange("cds", value)}
            PaperComponent={CustomPaper}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="CDS/Programmes"
                placeholder="CDS/Programmes"
                margin="normal"
                error={!!formErrors.cds}
                helperText={
                  formErrors.cds !== "" ? formErrors.cds : formData.cds === null ? "First select a degree level" : ""
                }
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderRadius: 8 }}>
                {option}
              </li>
            )}
          />
        </FormControl>
      </Stack>

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
          onChange={(event) => handleFormInputChange("requiredKnowledge", event.target.value)}
          error={!!formErrors.requiredKnowledge}
          helperText={formErrors.requiredKnowledge}
        />
      </FormControl>

      {/* Keywords field */}
      <FormControl fullWidth sx={{ mt: { md: 2, xs: 0 } }}>
        <TextField
          multiline
          rows={3}
          name="keywords"
          label="Keywords"
          margin="normal"
          value={formData.keywords}
          onChange={(event) => handleFormInputChange("keywords", event.target.value)}
          helperText={formErrors.keywords !== "" ? formErrors.keywords : "Write one keyword per line"}
          error={!!formErrors.keywords}
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
          onChange={(event) => handleFormInputChange("notes", event.target.value)}
        />
      </FormControl>
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 4, mb: 2 }}>
        {mode === "update" ? "Update Proposal" : "Create Proposal"}
      </Button>
    </Box>
  );
}

ProposalForm.propTypes = {
  mode: PropTypes.string,
  proposal: PropTypes.object,
  teachersList: PropTypes.array,
  degrees: PropTypes.array,
  proposals: PropTypes.array,
  createProposal: PropTypes.func,
  editProposal: PropTypes.func,
  setAlert: PropTypes.func,
  currentDate: PropTypes.string
};

export default ProposalForm;
