import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Requests from "../../Components/Cards/Requests";

const requestsPageStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    boxSizing: "border-box"
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "32px",
    fontWeight: 600
};

const RequestsPage = ({
    RequestsData = [],
    OnAccept,
    OnDecline,
    OnCancel
}) => {
    const location = useLocation();

    const userData = location.state.userData;

    const AcceptRequest = (Request) => {
        if(OnAccept) {
            OnAccept(Request);
        }
    };

    const DeclineRequest = (Request) => {
        if(OnDecline) {
            OnDecline(Request);
        }
    };

    const CancelRequest = (Request) => {
        if(OnCancel) {
            OnCancel(Request);
        }
    };

    return(
        <div className="requestsPage" style={requestsPageStyle}>
            <h1 style={titleStyle}>Requests</h1>

            <Requests
                RequestsData={RequestsData}
                CurrentUserId={userData.id}
                OnAccept={AcceptRequest}
                OnDecline={DeclineRequest}
                OnCancel={CancelRequest}
            />
        </div>
    );
};

export default RequestsPage;
