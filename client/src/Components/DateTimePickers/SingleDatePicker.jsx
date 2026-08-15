import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const SingleDatePicker = ({OnDateChanged}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Date"
      onChange={OnDateChanged}
      disablePast
    />
  </LocalizationProvider>
);

export default SingleDatePicker;
