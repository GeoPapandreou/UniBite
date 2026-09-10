import Chip from "@mui/material/Chip";

import Constants from "../../Shared/Constants";

const allergenChipContainerStyle = {
    height: "auto",
    padding: "4px",
    fontFamily: Constants.FontFamily,
    fontWeight: 600,
    fontSize: "100%"
};

const AllergenChip = ({
    Text,
    BorderRadius = "16px",
    Color = Constants.Red,
    BackColor = Constants.VeryLightRed,
    BorderColor = Constants.Red,
    Size = "medium"
}) => {
    const allergenChipStyle = {
        color: `#${Color}`,
        backgroundColor: `#${BackColor}`,
        borderColor: `#${BorderColor}`,
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: `${BorderRadius}`
    };

    return(
        <Chip
            label={Text}
            size={Size}
            style={{...allergenChipContainerStyle, ...allergenChipStyle}}
        />
    );
};

export default AllergenChip;
