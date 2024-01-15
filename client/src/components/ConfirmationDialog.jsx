import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmationDialog(props) {
  const { title, message, primaryButtonLabel, secondaryButtonLabel, open, handleClose, handleSubmit } = props;
  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>
      <DialogTitle variant="h5">{title}</DialogTitle>
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
          {secondaryButtonLabel}
        </Button>
        <Button fullWidth onClick={handleSubmit} variant="contained">
          {primaryButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  primaryButtonLabel: PropTypes.string,
  secondaryButtonLabel: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default ConfirmationDialog;
