import Button from "@mui/material/Button";
import Constants from "../../Shared/Constants";


// Navigation Buttons for the Menu Page
const MenuButton = ({OnClick, Text, Color = Constants.Gray}) => {
  return (
    <Button
      variant="contained"
      onClick={OnClick}
      sx={{backgroundColor: `#${Color}`}}>
      {Text}
    </Button>
  );
};

export default MenuButton;