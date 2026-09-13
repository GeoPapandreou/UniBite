import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Constants from "../../Shared/Constants";
import MenuButton from "../Buttons/MenuButton";
import MessageDialog from "../Dialogs/MessageDialog";

const UserSideMenu = () => {
    const navigate = useNavigate();

    /**
     ** The current location object, which represents the current URL in web browsers.
     */
    const location = useLocation();

    /**
     ** The user data from the state
     */
    const {userData} = location.state;

    const [exitDialog_IsOpen, exitDialog_SetIsOpen] = useState(false);

    const ExitDialog_IsOpenHandler = () => exitDialog_SetIsOpen(!exitDialog_IsOpen);

    /**
     ** Navigates to the home page of the user
     */
    const GoToHomePage = () => {
        navigate("home", {state: {userData: userData}});
    };

    /**
     ** Navigates to the listings created by the user
     */
    const GoToMyListingsPage = () => {
        navigate("my-listings", {state: {userData: userData}});
    };

    /**
     ** Navigates to the requests page of the user
     */
    const GoToRequestsPage = () => {
        navigate("requests", {state: {userData: userData}});
    };

    /**
     ** Navigates to the profile page of the user
     */
    const GoToProfilePage = () => {
        navigate("profile", {state: {userData: userData}});
    };

    /**
     ** Navigates to the login page
     */
    const GoToLogInPage = () => {
        navigate("/", {state: {userData: null}});
    };

    /**
     ** Reveals the log out dialog
     */
    const LogOutOnClick = () => ExitDialog_IsOpenHandler();

    return(
        <div className="sideMenu">
            <MenuButton
                Text="Listings"
                VectorSource={Constants.Home}
                OnClick={GoToHomePage}
            />
            <MenuButton
                Text="My Listings"
                VectorSource={Constants.Clipboard}
                OnClick={GoToMyListingsPage}
            />
            <MenuButton
                Text="Requests"
                VectorSource={Constants.Clipboard}
                OnClick={GoToRequestsPage}
            />
            <MenuButton
                Text="Profile"
                VectorSource={Constants.AccountCircle}
                OnClick={GoToProfilePage}
            />

            <div className="menuExitButton">
                <MenuButton
                    Text="Log out"
                    VectorSource={Constants.ExitToApp}
                    OnClick={LogOutOnClick}
                />
            </div>

            <MessageDialog
                Title="Log Out"
                Text="Are you sure you want to log out?"
                IsOpen={exitDialog_IsOpen}
                IsOpenHandler={ExitDialog_IsOpenHandler}
                Color={Constants.LightBlue}
                BackColor={Constants.VeryLightRed}
                YesOnClick={() => {ExitDialog_IsOpenHandler(); GoToLogInPage();}}
                NoOnClick={() => {ExitDialog_IsOpenHandler();}}
            />
        </div>
    );
};

export default UserSideMenu;
