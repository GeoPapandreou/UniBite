import Button from "@mui/material/Button";
import Constants from "../../Shared/Constants";

const textButtonContainerStyle = {
    minWidth: "5rem",
    width: "auto",
    height: "auto",
    padding: "4px"
};

const textButtonContentStyle = {
    height: "100%",
    width: "100%",
    textTransform: "capitalize",
    fontFamily: Constants.FontFamily,
    fontWeight: 600,
    fontSize: "140%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const TextButton = ({ 
    Text,
    OnClick,
    BorderRadius = "50%",
    Color= Constants.White,
    BackColor = Constants.LightBlue,
    IsRaised = true
}) => {
    const textButtonStyle = {
        color: `#${Color}`,
        backgroundColor: `#${BackColor}`,
        borderRadius: BorderRadius,
        boxShadow: `${IsRaised ? Constants.BoxShadow : ""}` 
    };
    
    return(
        <Button id="textButton"
            style={{...textButtonContainerStyle, ...textButtonStyle}}
            onClick={OnClick}>
            <div style={textButtonContentStyle}>
                <span>{Text}</span>
            </div>
        </Button>
    );
};

export default TextButton;