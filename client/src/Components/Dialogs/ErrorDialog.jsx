import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Constants from "../../Shared/Constants";

const dialogStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "auto",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow,
    borderRadius: "8px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box"
};

const dialogContentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px"
};

const dialogIconCircleStyle = {
    width: "4rem",
    height: "4rem",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const svgContainerStyle = {
    width: "3rem",
    height: "3rem"
};

const dialogTextStyle = {
    margin: 0,
    fontFamily: Constants.FontFamily,
    fontSize: "24px",
    color: `#${Constants.Gray}`,
    fontWeight: 400,
    textAlign: "center"
};

const dialogTitleStyle = {
    fontFamily: Constants.FontFamily,
    fontSize: "24px",
    fontWeight: 600
};

const ErrorDialog = ({
    Text,
    Color = Constants.Red,
    BackColor = Constants.VeryLightRed,
    VectorSource,
    IsOpen,
    IsOpenHandler
}) => {
    const dialogCircleStyle = {
        backgroundColor: `#${BackColor}`
    };

    const titleStyle = {
        color: `#${Color}`
    };

    return(
        <Modal open={IsOpen} onClose={IsOpenHandler}>
            <Box style={dialogStyle}>
                <div className="dialogContent" style={dialogContentStyle}>
                    {VectorSource && (
                        <div style={{...dialogIconCircleStyle, ...dialogCircleStyle}}>
                            <svg style={svgContainerStyle} viewBox="0 0 24 24">
                                <path fill={`#${Color}`} d={VectorSource}/>
                            </svg>
                        </div>
                    )}

                    <span style={{...dialogTitleStyle, ...titleStyle}}>ERROR</span>
                    <span style={dialogTextStyle}>{Text}</span>
                </div>
            </Box>
        </Modal>
    );
};

export default ErrorDialog;
