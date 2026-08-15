import { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const SingleDatePicker = ({
  OnDateChanged,
  Label = "Date",
  DisablePast = false,
  HasFullWidth = true
}) => {
  const [SelectedDate, SetSelectedDate] = useState(null);

  const HandleDateChanged = (NewDate) => {
    SetSelectedDate(NewDate);
    OnDateChanged?.(NewDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={Label}
        value={SelectedDate}
        onChange={HandleDateChanged}
        disablePast={DisablePast}
        slotProps={{
          textField: {
            fullWidth: HasFullWidth
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default SingleDatePicker;
