import MenuButton from "./Components/Buttons/MenuButton";
import Constants from "./Shared/Constants";
import TextButton from "./Components/Buttons/TextButton";
import Loading from "./Components/Animations/Loading";
import TextInput from "./Components/Inputs/TextInput";
import SingleDatePicker from "./Components/DateTimePickers/SingleDatePicker";
import SingleTimePicker from "./Components/DateTimePickers/SingleTimePicker";



function App() {
  return (
    <div className="App" style={{ backgroundColor: `#${Constants.White}` }}>
      <TextButton Text="Menu"/>
      <MenuButton Text="Accept"/>
      <TextInput/>
      <SingleDatePicker Label="Date"/>
      <SingleTimePicker Label="Time"/>
    </div>  
  )
}

export default App;