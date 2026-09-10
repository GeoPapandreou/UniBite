import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Constants from "../../Shared/Constants";
import MenuButton from "../Buttons/MenuButton";
import MessageDialog from "../Dialogs/MessageDialog";

const AdminSideMenu = () => {
    const navigate = useNavigate();

    /**
     ** The current location object, which represents the current URL in web browsers.
     */
    const location = useLocation();

    /**
     ** The admin data from the state
     */
    const adminData = location.state.adminData;

    const [exitDialog_IsOpen, exitDialog_SetIsOpen] = useState(false);

    const ExitDialog_IsOpenHandler = () => exitDialog_SetIsOpen(!exitDialog_IsOpen);

    /**
     ** Navigates to the statistics page of the admin
     */
    const GoToStatisticsPage = () => {
        navigate("statistics", {state: {userData: null, adminData: adminData}});
    };

    /**
     ** Navigates to the leaderboard page of the admin
     */
    const GoToLeaderboardPage = () => {
        navigate("leaderboard", {state: {userData: null, adminData: adminData}});
    };

    /**
     ** Navigates to the login page
     */
    const GoToLogInPage = () => {
        navigate("/", {state: {userData: null, adminData: adminData}});
    };

    /**
     ** Shows the exit dialog if exitDialog_IsOpen is true
     */
    const LogOutOnClick = () => ExitDialog_IsOpenHandler();

    return(
        <div className="sideMenu">
            <MenuButton
                Text="Statistics"
                VectorSource={Constants.Chart}
                OnClick={GoToStatisticsPage}
            />
            <MenuButton
                Text="Leaderboard"
                VectorSource={Constants.Trophy}
                OnClick={GoToLeaderboardPage}
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

export default AdminSideMenu;
