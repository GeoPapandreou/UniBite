import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";

import Constants from "../../Shared/Constants";

const MenuButton = ({
    OnClick,
    Text,
    VectorSource,
    Color = Constants.Gray,
}) => {
    const menuButtonStyle = {
        width: "100%",
        padding: "1em",
        color: `#${Color}`
    };

    return(
        <div className="menuButtonContainer">
            <Button id="menuButton" style={menuButtonStyle} onClick={OnClick}>
                <div className="menuButtonContent">
                    {VectorSource && (
                        <SvgIcon>
                            <path fill={`#${Color}`} d={VectorSource}/>
                        </SvgIcon>
                    )}
                    <span className="menuButtonText">{Text}</span>
                </div>
            </Button>
        </div>
    );
};

export default MenuButton;
