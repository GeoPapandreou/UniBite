import IconButton from "@mui/material/IconButton";

import Constants from "../../Shared/Constants";

const vectorButtonContainerStyle = {
    width: "100%",
    height: "100%",
    padding: "0.5rem",
    boxShadow: Constants.BoxShadow
};

const vectorButtonContentStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const svgContainerStyle = {
    width: "100%",
    height: "100%"
};

const VectorButton = ({ 
    OnClick,
    VectorSource, 
    BorderRadius = "50%",
    Size = "3rem",
    Color = Constants.White,
    BackColor = Constants.LightBlue
}) => {
    const vectorButtonStyle = {
        width: `${Size}`,
        height: `${Size}`,
        color: `#${Color}`,
        backgroundColor: `#${BackColor}`,
        borderRadius: `${BorderRadius}`
    };
    
    return(
        <IconButton id="vectorButton"
            style={{...vectorButtonContainerStyle, ...vectorButtonStyle}}
            onClick={OnClick}>
            <div style={vectorButtonContentStyle}>
                <svg style={svgContainerStyle} viewBox="0 0 24 24">
                    <path fill={`#${Color}`} d={VectorSource} />
                </svg>
            </div>
        </IconButton>
    );
};

export default VectorButton;
