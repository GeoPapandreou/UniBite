import Constants from "../../Shared/Constants";
import RequestCard from "./RequestCard";

const requestsContainerStyle = {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 350px))",
    justifyContent: "center",
    gap: "24px",
    padding: "24px",
    boxSizing: "border-box"
};

const emptyMessageStyle = {
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "18px"
};

const Requests = ({
    RequestsData = [],
    CurrentUserId,
    IsSaving = false,
    OnAccept,
    OnDecline,
    OnCancel
}) => {
    if(RequestsData.length === 0) {
        return(
            <p style={emptyMessageStyle}>No requests available.</p>
        );
    }

    return(
        <div className="requestsContainer" style={requestsContainerStyle}>
            {RequestsData.map((Request) => (
                <RequestCard
                    key={Request.id}
                    ListingTitle={Request.listingTitle}
                    RequesterName={Request.requesterName}
                    Portions={Request.portion}
                    PickupDateTime={Request.pickupDateTime}
                    PickupLocation={Request.pickupLocation}
                    IsApproved={Request.isApproved}
                    IsListingOwner={CurrentUserId === Request.cookId}
                    IsSaving={IsSaving}
                    OnAccept={OnAccept ? () => OnAccept(Request) : undefined}
                    OnDecline={OnDecline ? () => OnDecline(Request) : undefined}
                    OnCancel={OnCancel ? () => OnCancel(Request) : undefined}
                />
            ))}
        </div>
    );
};

export default Requests;
