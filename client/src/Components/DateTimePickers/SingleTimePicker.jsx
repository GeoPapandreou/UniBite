import { useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
          light: "#9cc9e1",
          main: "#84BCDA",
          dark: "#5c8398",
          contrastText: "#F5F5F5",
        },
        secondary: {
          light: "#f4cd71",
          main: "#F2C14E",
          dark: "#a98736",
          contrastText: "#F5F5F5",
        }
    },
});

export default function SingleTimePicker({OnTimeChanged}) {
    const [time, setTime] = useState(null);

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                    label="Time"
                    value={time}
                    onChange={(newValue) => {
                        setTime(newValue);
                        OnTimeChanged(newValue);
                    }}
                    ampm={true}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}
