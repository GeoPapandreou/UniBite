import { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";

const SingleTimePicker = ({
  OnTimeChanged,
  Label = "Time",
  Is24Hour = true,
  HasFullWidth = true
}) => {
  const [SelectedTime, SetSelectedTime] = useState(null);

  const HandleTimeChanged = (NewTime) => {
    SetSelectedTime(NewTime);
    OnTimeChanged?.(NewTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiTimePicker
        label={Label}
        value={SelectedTime}
        onChange={HandleTimeChanged}
        ampm={!Is24Hour}
        slotProps={{
          textField: {
            fullWidth: HasFullWidth
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default SingleTimePicker;
