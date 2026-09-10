import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";

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

    const userData = location.state.userData;

    return(
        <div className="profilePage" style={profilePageStyle}>
            <h1 style={titleStyle}>Profile</h1>

            {userData ? (
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
        </div>
    );
};

export default ProfilePage;
