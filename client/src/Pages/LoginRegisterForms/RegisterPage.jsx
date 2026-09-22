import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import Constants from "../../Shared/Constants";
import TextButton from "../../Components/Buttons/TextButton";
import TextInput from "../../Components/Inputs/TextInput";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

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

const RegisterPage = () => {
    const navigate = useNavigate();

    const [universityId, setUniversityId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [universities, setUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const registrationInProgress = useRef(false);

    // Load the universities from the database.
    useEffect(() => {
        // fetch GET fills the university selector with the database's universities.
        fetch("/api/Unibite/universities")
            // Parse the HTTP body into JavaScript data, then store it.
            .then(Response => Response.json())
            .then(UniversitiesData => setUniversities(UniversitiesData))
            // catch handles rejected operations; finally ends loading after success or failure.
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    const isFormValid = universityId !== "" &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        email.trim() !== "" &&
        username.trim() !== "" &&
        password.trim() !== "";

    /**
     ** Creates an account and returns to login without reloading the page
     */
    const RegisterButton_OnClick = async() => {
        if(!isFormValid || isLoading || registrationInProgress.current) return;

        registrationInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // fetch POST sends registration as JSON; the database gives the new user 5 starting credits.
            const response = await fetch("/api/Unibite/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    universityId: Number(universityId),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    username: username.trim(),
                    password: password
                })
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not create your account. Please try again.");

            // Return to Login only after the API confirms the account was created.
            navigate("/");
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            registrationInProgress.current = false;
            setIsSaving(false);
        }
    };

    const CancelButton_OnClick = () => {
        if(registrationInProgress.current) return;
        navigate("/");
    };

    return(
        <div className="registerPage" style={registerPageStyle}>
            <div className="registerForm" style={registerFormStyle}>
                <h1 style={titleStyle}>Register</h1>

                <TextField
                    select
                    label={isLoading ? "Loading universities..." : "University"}
                    value={universityId}
                    onChange={(event) => setUniversityId(event.target.value)}
                    fullWidth
                    disabled={isLoading || isSaving}
                    style={universityInputStyle}>
                    {universities.map((University) => (
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
                        Disabled={isSaving}
                    />
                    <TextButton
                        Text={isSaving ? "Registering..." : "Register"}
                        OnClick={RegisterButton_OnClick}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Green}
                        Disabled={!isFormValid || isLoading || isSaving}
                    />
                </div>
            </div>
            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default RegisterPage;