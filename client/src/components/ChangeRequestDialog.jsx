import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

function ChangeRequestDialog(props) {
  const { changesMessage, setChangesMessage, changesError, setChangesError, open, handleClose, handleSubmit } = props;

  const handleChange = (event) => {
    setChangesMessage(event.target.value);
    setChangesError("");
  };

  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle variant="h5">Require Changes</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          You can require the student to make some changes to this thesis request except for the supervisor field.
        </DialogContentText>
        <TextField
          sx={{ mb: changesError ? -1 : 2 }}
          fullWidth
          required
          multiline
          rows={3}
          label="Message"
          margin="normal"
          value={changesMessage}
          onChange={handleChange}
          error={!!changesError}
          helperText={changesError}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: 3,
          mb: 2
        }}
      >
        <Button fullWidth onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button fullWidth onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ChangeRequestDialog.propTypes = {
  changesMessage: PropTypes.string,
  setChangesMessage: PropTypes.func,
  changesError: PropTypes.string,
  setChangesError: PropTypes.func,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default ChangeRequestDialog;
