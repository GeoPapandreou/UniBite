import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import Constants from "../../Shared/Constants";
import TextButton from "../../Components/Buttons/TextButton";
import TextInput from "../../Components/Inputs/TextInput";

const registerPageStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    backgroundColor: `#${Constants.White}`,
    boxSizing: "border-box"
};

const registerFormStyle = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow,
    boxSizing: "border-box"
};

const universityInputStyle = {
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "32px",
    fontWeight: 600
};

const registerButtonsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "8px"
};

const RegisterPage = ({
    UniversitiesData = [],
    OnRegister
}) => {
    const navigate = useNavigate();

    const [universityId, setUniversityId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isFormValid = universityId !== "" &&
        firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        username !== "" &&
        password !== "";

    const RegisterButton_OnClick = () => {
        if(OnRegister) {
            OnRegister({
                universityId: universityId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password
            });
        }
    };

    const CancelButton_OnClick = () => {
        navigate("/");
    };

    return(
        <div className="registerPage" style={registerPageStyle}>
            <div className="registerForm" style={registerFormStyle}>
                <h1 style={titleStyle}>Register</h1>

                <TextField
                    select
                    label="University"
                    value={universityId}
                    onChange={(event) => setUniversityId(event.target.value)}
                    fullWidth
                    style={universityInputStyle}>
                    {UniversitiesData.map((University) => (
                        <MenuItem key={University.id} value={University.id}>
                            {University.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextInput
                    Text={firstName}
                    OnTextChanged={(event) => setFirstName(event.target.value)}
                    Hint="First name"
                    HasFloatingHint={true}
                    HasFullWidth={true}
                />

                <TextInput
                    Text={lastName}
                    OnTextChanged={(event) => setLastName(event.target.value)}
                    Hint="Last name"
                    HasFloatingHint={true}
                    HasFullWidth={true}
                />

                <TextInput
                    Text={email}
                    Type="email"
                    OnTextChanged={(event) => setEmail(event.target.value)}
                    Hint="Email"
                    HasFloatingHint={true}
                    HasFullWidth={true}
                />

                <TextInput
                    Text={username}
                    OnTextChanged={(event) => setUsername(event.target.value)}
                    Hint="Username"
                    HasFloatingHint={true}
                    HasFullWidth={true}
                />

                <TextInput
                    Text={password}
                    Type="password"
                    OnTextChanged={(event) => setPassword(event.target.value)}
                    Hint="Password"
                    HasFloatingHint={true}
                    HasFullWidth={true}
                />

                <div style={registerButtonsStyle}>
                    <TextButton
                        Text="Cancel"
                        OnClick={CancelButton_OnClick}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Gray}
                        IsRaised={false}
                    />
                    <TextButton
                        Text="Register"
                        OnClick={RegisterButton_OnClick}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Green}
                        Disabled={!isFormValid}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
