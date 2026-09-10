import { useState } from "react";

import Constants from "../../Shared/Constants";
import Listings from "../../Components/Cards/Listings";
import OrderForm from "../../Components/Cards/OrderForm";

const homePageStyle = {
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

const HomePage = ({
    ListingsData = [],
    OnOrder
}) => {
    const [selectedListing, setSelectedListing] = useState(null);

    const OpenOrderForm = (Listing) => {
        setSelectedListing(Listing);
    };

    const CloseOrderForm = () => {
        setSelectedListing(null);
    };

    const ConfirmOrder = (OrderData) => {
        if(OnOrder) {
            OnOrder(selectedListing, OrderData);
        }
    };

    return(
        <div className="homePage" style={homePageStyle}>
            <h1 style={titleStyle}>Available Listings</h1>

            <Listings
                ListingsData={ListingsData}
                OnOrder={OpenOrderForm}
            />

            {selectedListing && (
                <OrderForm
                    IsOpen={true}
                    ListingTitle={selectedListing.title}
                    AvailablePortions={selectedListing.portions}
                    OnConfirm={ConfirmOrder}
                    OnClose={CloseOrderForm}
                />
            )}
        </div>
    );
};

export default HomePage;