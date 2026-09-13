import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Constants from "../../Shared/Constants";

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

const textInputStyle = {
    boxShadow: Constants.BoxShadow,
    borderRadius: "4px",
    overflow: "hidden",
    backgroundColor: `#${Constants.White}`
};

const TextInput = ({ 
        Text,
        Type = "text",
        Disabled = false,
        OnTextChanged, 
        Hint = "hint", 
        HasFullWidth = false,
        Multiline = false,
        Rows = 1,
        Theme = theme,
        ThemeColor = "primary" 
    }) => {
    return(
        <div className="textInput" >
            <ThemeProvider theme={Theme}>
                <TextField style={textInputStyle}
                        color={ThemeColor}
                        variant="outlined" 
                        value={Text}
                        type={Type}
                        disabled={Disabled}
                        multiline={Multiline}
                        rows={Rows}
                        onChange={OnTextChanged}
                        placeholder={Hint}
                        slotProps={{htmlInput: {"aria-label": Hint}}}
                        fullWidth={HasFullWidth}/>
            </ThemeProvider>
        </div>
    );
};

export default TextInput;
