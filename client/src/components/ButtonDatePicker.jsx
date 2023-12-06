import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

function ButtonField(props) {
  const { setOpen, label, InputProps: { ref } = {} } = props;

  return (
    <Button
      sx={{ height: 55, borderRadius: 40, px: 3 }}
      color="inherit"
      ref={ref}
      startIcon={<EditCalendarIcon />}
      onClick={() => setOpen((prev) => !prev)}
    >
      {label}
    </Button>
  );
}

ButtonField.propTypes = {
  setOpen: PropTypes.func,
  label: PropTypes.string,
  InputProps: PropTypes.object
};

function ButtonDatePicker(props) {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

ButtonDatePicker.propTypes = {
  slots: PropTypes.object
};

export default ButtonDatePicker;
