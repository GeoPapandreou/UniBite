import Constants from "../../Shared/Constants";
import ListingCard from "./ListingCard";

const listingsContainerStyle = {
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

const Listings = ({
    ListingsData = [],
    OnOrder
}) => {
    if(ListingsData.length === 0) {
        return(
            <p style={emptyMessageStyle}>No listings available.</p>
        );
    }

    return(
        <div className="listingsContainer" style={listingsContainerStyle}>
            {ListingsData.map((Listing) => (
                <ListingCard
                    key={Listing.id}
                    ImageSource={Listing.photo}
                    Title={Listing.title}
                    Notes={Listing.notes}
                    Portions={Listing.portions}
                    Allergens={Listing.allergens}
                    Status={Listing.status}
                    OnOrder={OnOrder ? () => OnOrder(Listing) : undefined}
                />
            ))}
        </div>
    );
};

export default Listings;
