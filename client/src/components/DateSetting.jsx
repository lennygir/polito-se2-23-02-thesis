import dayjs from "dayjs";
import { FormControlLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function DateSetting(props) {
  const handleChange = (newDate) => {
    props.setCurrentDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  return (
    <FormControlLabel
      sx={{ marginY: 2 }}
      value="start"
      control={
        <DatePicker
          slotProps={{ textField: { size: "small", color: "primary" } }}
          sx={{ m: 1, ml: 9 }}
          defaultValue={dayjs(props.currentDate)}
          value={dayjs(props.currentDate)}
          onChange={handleChange}
          disableFuture={false}
          disablePast
          format="DD/MM/YYYY"
        />
      }
      label="Current Date"
      labelPlacement="start"
    />
  );
}

export default DateSetting;
