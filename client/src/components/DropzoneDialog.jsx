import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FilePond } from "react-filepond";

import "filepond/dist/filepond.min.css";

function DropzoneDialog(props) {
  const { files, setFiles, message, open, handleClose, handleSubmit } = props;

  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle variant="h5">Confirm Decision</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }} variant="body1">
          {message}
        </DialogContentText>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          acceptedFileTypes={["application/pdf"]}
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
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

DropzoneDialog.propTypes = {
  files: PropTypes.array,
  setFiles: PropTypes.func,
  message: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default DropzoneDialog;
