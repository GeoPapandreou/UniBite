import { useLocation, Outlet } from "react-router-dom";

import Constants from "../Shared/Constants";
import UserSideMenu from "../Components/SideMenus/UserSideMenu";
import AdminSideMenu from "../Components/SideMenus/AdminSideMenu";
import HeaderBar from "../Components/HeaderBar";

const pageContainerStyle = {
    width: "100%",
    minWidth: 0,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    backgroundColor: `#${Constants.White}`,
    gap: "2em",
    overflow: "auto"
};

const LayoutPage = () => {
    const location = useLocation();

    // Login and sidebar navigation pass these objects through navigate(..., {state: ...}).
    const {userData, adminData} = location.state;

    // Outlet displays the selected child page while the header and sidebar remain shared.
    return(
        <>
            <HeaderBar Username={userData ? userData.username : adminData.username}/>

            <div className="page">
                {userData == null
                    ? (
                        <AdminSideMenu/>
                    )
                    : (
                        <UserSideMenu/>
                    )}

                <div className="pageContainer" style={pageContainerStyle}>
                    <Outlet/>
                </div>
            </div>
        </>
    );
};

export default LayoutPage;
