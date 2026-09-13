import Constants from "../Shared/Constants";

const headerBarStyle = {
    position: "sticky",
    top: 0,
    left: 0,
    width: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "4rem",
    padding: "0 1em",
    zIndex: 10,
    backgroundColor: `#${Constants.LightBlue}`,
    boxShadow: Constants.BoxShadow
};

const headerTitleStyle = {
    color: `#${Constants.White}`,
    fontFamily: Constants.FontFamily,
    fontSize: "28px",
    fontWeight: 600
};

const HeaderBar = () => {
    return(
        <div className="headerBar" style={headerBarStyle}>
            <div style={headerTitleStyle}>UniBite</div>
        </div>
    );
};

export default HeaderBar;
