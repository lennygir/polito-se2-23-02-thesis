import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CustomPaper from "./CustomPaper";

function BaseForm(props) {
  const { formData, formErrors, handleFormInputChange, teachers } = props;

  const ChipProps = { sx: { height: 26 } };

  return (
    <>
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

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="start"
        spacing={{ md: 2, xs: -1 }}
        sx={{ mt: { md: 2, xs: 1 } }}
      >
        {/* Supervisor field */}
        <FormControl fullWidth error={!!formErrors.supervisor}>
          <Autocomplete
            name="supervisor"
            required
            options={teachers.map((teacher) => teacher.email)}
            value={formData.supervisor}
            onChange={(event, value) => handleFormInputChange("supervisor", value)}
            PaperComponent={<CustomPaper />}
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
            name="coSupervisors"
            options={teachers.map((teacher) => teacher.email)}
            value={formData.coSupervisors}
            onChange={(event, value) => handleFormInputChange("coSupervisors", value)}
            filterSelectedOptions
            PaperComponent={<CustomPaper />}
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
    </>
  );
}

BaseForm.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.object,
  handleFormInputChange: PropTypes.func,
  teachers: PropTypes.array
};

export default BaseForm;
