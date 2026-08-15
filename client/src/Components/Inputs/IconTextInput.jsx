import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
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

const IconTextInput = ({ 
        Text, 
        Type,
        OnTextChanged, 
        VectorSource, 
        VectorColor = Constants.Gray,
        Hint = "hint", 
        HasFloatingHint = false, 
        HasFullWidth = false,
        Theme = theme,
        ThemeColor = "primary",
        Size = "medium"
    }) => {
    return(
        <div className="textInput">
            <ThemeProvider theme={Theme}>
                <TextField style={textInputStyle} size={Size}
                        color={ThemeColor}
                        variant="outlined" 
                        autoComplete="off"
                        value={Text}
                        type={Type}
                        onChange={OnTextChanged}
                        fullWidth={HasFullWidth}
                        label={Text === "" ? Hint : ""} 
                        slotProps={{
                            inputLabel: {
                                shrink: HasFloatingHint
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon>
                                            <path fill={`#${VectorColor}`} d={VectorSource} />
                                        </SvgIcon>
                                    </InputAdornment>
                                )
                            }
                        }}/>
            </ThemeProvider>
        </div>
    );
};

export default IconTextInput;
