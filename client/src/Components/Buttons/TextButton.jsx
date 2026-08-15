import Button from "@mui/material/Button";
import Constants from "../../Shared/Constants";


// Buttons like Accept, Decline etc.
const TextButton = ({OnClick, Text, Color=Constants.Gray, TextColor=Constants.Black, BorderColor=Constants.Black}) => {
  return (
    <Button
      variant="outlined"
      onClick={OnClick}
      sx={{backgroundColor: `#${Color}`, color: `#${TextColor}`, borderColor: `#${BorderColor}`}}>
      {Text}
    </Button>
  );
};

export default TextButton;