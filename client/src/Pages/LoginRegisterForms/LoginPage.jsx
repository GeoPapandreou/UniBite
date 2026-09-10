import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Constants from "../../Shared/Constants";
import TextButton from "../../Components/Buttons/TextButton";
import TextInput from "../../Components/Inputs/TextInput";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

const loginPageStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    backgroundColor: `#${Constants.White}`,
    boxSizing: "border-box"
};

const loginFormStyle = {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow,
    boxSizing: "border-box"
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "32px",
    fontWeight: 600
};

const loginButtonsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "8px"
};

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const isFormValid = username !== "" && password !== "";

    /**
     ** Logs in the user or admin if the credentials are correct
     */
    const LoginButton_OnClick = async() => {
        try {
            const usersResponse = await fetch("/api/Unibite/users");
            const adminsResponse = await fetch("/api/Unibite/admins");

            if(!usersResponse.ok || !adminsResponse.ok) {
                throw new Error("Could not connect to the server.");
            }

            const users = await usersResponse.json();
            const admins = await adminsResponse.json();

            const userData = users.find((User) =>
                User.username === username && User.password === password
            );

            if(userData) {
                navigate(`users/${userData.id}/home`, {
                    state: {userData: userData}
                });
                return;
            }

            const adminData = admins.find((Admin) =>
                Admin.username === username && Admin.password === password
            );

            if(adminData) {
                navigate(`admins/${adminData.id}/statistics`, {
                    state: {adminData: adminData}
                });
                return;
            }

            setErrorMessage("Incorrect username or password.");
        }
        catch(error) {
            setErrorMessage(error.message);
        }
    };

    const RegisterButton_OnClick = () => {
        navigate("sign-up");
    };

    return(
        <div className="loginPage" style={loginPageStyle}>
            <div className="loginForm" style={loginFormStyle}>
                <h1 style={titleStyle}>Login</h1>

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

                <div style={loginButtonsStyle}>
                    <TextButton
                        Text="Register"
                        OnClick={RegisterButton_OnClick}
                        BorderRadius="8px"
                        Color={Constants.Gray}
                        BackColor={Constants.White}
                        IsRaised={false}
                    />
                    <TextButton
                        Text="Login"
                        OnClick={LoginButton_OnClick}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Green}
                        Disabled={!isFormValid}
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

export default LoginPage;
