import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

/**
 *
 * @param {props} props { mode, message, open, handleClose, handleSubmit }
 * @returns Confirmation dialog to confirm or deny action
 */
function ConfirmationDialog(props) {
  const { mode, message, open, handleClose, handleSubmit } = props;
  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>
      <DialogTitle variant="h5">Confirm Decision</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">{message}</DialogContentText>
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
          {mode === "submit" ? "Cancel" : "No"}
        </Button>
        <Button fullWidth onClick={handleSubmit} variant="contained">
          {mode === "submit" ? "Submit" : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  mode: PropTypes.string,
  message: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default ConfirmationDialog;
