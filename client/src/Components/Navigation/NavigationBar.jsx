import Constants from "../../Shared/Constants";
import MenuButton from "../Buttons/MenuButton";

const navigationBarStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    boxSizing: "border-box",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow
};

const NavigationBar = ({
    OnListingsClick,
    OnRequestsClick,
    OnProfileClick,
    OnLogoutClick
}) => {
    return(
        <nav className="navigationBar" style={navigationBarStyle}>
            <MenuButton
                Text="Listings"
                OnClick={OnListingsClick}
            />
            <MenuButton
                Text="Requests"
                OnClick={OnRequestsClick}
            />
            <MenuButton
                Text="Profile"
                OnClick={OnProfileClick}
            />
            <MenuButton
                Text="Logout"
                OnClick={OnLogoutClick}
            />
        </nav>
    );
};

export default NavigationBar;
