import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const SingleTimePicker = ({OnTimeChanged}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <TimePicker
      label="Time"
      onChange={OnTimeChanged}
      ampm={false}
    />
  </LocalizationProvider>
);

export default SingleTimePicker;
