import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

const profilePageStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    boxSizing: "border-box"
};

const profileCardStyle = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    padding: "24px",
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

const profileTextStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "18px"
};

const ProfilePage = () => {
    const location = useLocation();

    const userId = location.state?.userData?.id;
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(!!userId);
    const [errorMessage, setErrorMessage] = useState("");

    // Load current user data instead of displaying the balance saved at login.
    useEffect(() => {
        if(!userId) return;

        // fetch GET reads the latest credits instead of displaying the balance saved at login.
        fetch(`/api/Unibite/users/${userId}`)
            .then(Response => Response.json())
            .then(UserData => setUserData(UserData))
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    }, [userId]);

    return(
        <div className="profilePage" style={profilePageStyle}>
            <h1 style={titleStyle}>Profile</h1>

            {isLoading ? <Loading/> : userData ? (
                <div className="profileCard" style={profileCardStyle}>
                    <p style={profileTextStyle}>
                        Name: {userData.firstName} {userData.lastName}
                    </p>
                    <p style={profileTextStyle}>Username: {userData.username}</p>
                    <p style={profileTextStyle}>Email: {userData.email}</p>
                    <p style={profileTextStyle}>Credits: {userData.credits}</p>
                </div>
            ) : (
                <p style={profileTextStyle}>No user data available.</p>
            )}

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default ProfilePage;
