import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Button, FormControl, FormControlLabel, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

function DateSetting(props) {
  const { currentDate, setCurrentDate } = props;
  const [formDate, setFormDate] = useState(currentDate);

  const handleDateChange = () => {
    setCurrentDate(formDate);
    // TODO: update date in the backend and reload data
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <FormControl>
        <FormControlLabel
          sx={{ marginY: 2 }}
          value="start"
          control={
            <DatePicker
              slotProps={{ textField: { size: "small", color: "primary" } }}
              sx={{ m: 1, ml: 9 }}
              value={dayjs(formDate)}
              onChange={(newDate) => setFormDate(dayjs(newDate).format("YYYY-MM-DD"))}
              disableFuture={false}
              disablePast
              minDate={dayjs(currentDate)}
              format="DD/MM/YYYY"
            />
          }
          label="Current Date"
          labelPlacement="start"
        />
      </FormControl>
      <Button disabled={dayjs(formDate).isSame(dayjs(currentDate))} variant="contained" onClick={handleDateChange}>
        Save
      </Button>
    </Stack>
  );
}

DateSetting.propTypes = {
  currentDate: PropTypes.string,
  setCurrentDate: PropTypes.func
};

export default DateSetting;
