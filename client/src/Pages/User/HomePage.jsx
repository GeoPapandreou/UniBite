import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import CreateListingButton from "../../Components/Buttons/CreateListingButton";
import Loading from "../../Components/Animations/Loading";
import Listings from "../../Components/Cards/Listings";
import OrderForm from "../../Components/Cards/OrderForm";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

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

const messageStyle = {
    margin: 0,
    color: `#${Constants.Green}`,
    fontFamily: Constants.FontFamily,
    fontSize: "16px"
};

/**
 ** Gets the listings and their allergens for the user's university
 */
const GetListings = async(UniversityId) => {
    // fetch GET loads the related API data; Promise.all waits for all four responses.
    const responses = await Promise.all([
        fetch("/api/Unibite/listings"),
        fetch("/api/Unibite/listingAllergens"),
        fetch("/api/Unibite/allergens"),
        fetch("/api/Unibite/users")
    ]);

    if(responses.some(Response => !Response.ok)) {
        throw new Error("Could not load the listings. Please refresh the page.");
    }

    // Convert the JSON response bodies into JavaScript arrays used by the cards.
    const [listings, listingAllergens, allergens, users] = await Promise.all(
        responses.map(Response => Response.json())
    );

    // Show only active listings under 48 hours old from this university; database rows are kept.
    return listings.filter(Listing => Listing.isActive &&
        Date.now() - new Date(Listing.dateCreated).getTime() < 48 * 60 * 60 * 1000 && users.some(User =>
        User.id === Listing.cookId && User.universityId === UniversityId
    )).map(Listing => ({
        ...Listing,
        // MySQL returns the stored photo as a Buffer in JSON.
        photo: Listing.photo?.type === "Buffer"
            ? new TextDecoder().decode(new Uint8Array(Listing.photo.data))
            : Listing.photo,
        allergens: allergens.filter(Allergen => listingAllergens.some(Link =>
            Link.listingId === Listing.id && Link.allergensId === Allergen.id
        ))
    }));
};

const HomePage = () => {
    const location = useLocation();
    const userData = location.state.userData;
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        GetListings(userData.universityId)
            .then(ListingsData => {
                if(isMounted) setListings(ListingsData);
            })
            .catch(error => {
                if(isMounted) setErrorMessage(error.message);
            })
            .finally(() => {
                if(isMounted) setIsLoading(false);
            });

        // Remove newly expired listings while the homepage stays open.
        const expiryCheck = setInterval(() => {
            setListings(ListingsData => ListingsData.filter(Listing =>
                Date.now() - new Date(Listing.dateCreated).getTime() < 48 * 60 * 60 * 1000
            ));
        }, 60 * 1000);

        return () => {
            isMounted = false;
            clearInterval(expiryCheck);
        };
    }, [userData.universityId]);

    /**
     ** Refreshes the feed after a listing is created
     */
    const RefreshListings = async() => {
        setListings(await GetListings(userData.universityId));
        setErrorMessage("");
    };

    const OpenOrderForm = (Listing) => {
        setOrderMessage("");
        setErrorMessage("");

        if(Listing.cookId === userData.id) {
            setErrorMessage("You cannot order your own listing.");
            return;
        }

        setSelectedListing(Listing);
    };

    const CloseOrderForm = () => {
        setSelectedListing(null);
    };

    /**
     ** Saves a pending request without reducing the listing's portions
     */
    const ConfirmOrder = async(OrderData) => {
        if(isOrdering || !selectedListing) return;

        setIsOrdering(true);
        setErrorMessage("");

        try {
            // fetch POST sends the order as JSON. The backend deducts credits; portions change on approval.
            const response = await fetch("/api/Unibite/requests", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    listingId: selectedListing.id,
                    consumerId: userData.id,
                    portion: OrderData.Portions
                })
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not send the request. Please try again.");
            }

            CloseOrderForm();
            setOrderMessage("Your request was sent and is waiting for the cook to approve it.");
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            setIsOrdering(false);
        }
    };

    return(
        <div className="homePage" style={homePageStyle}>
            <h1 style={titleStyle}>Available Listings</h1>

            <CreateListingButton
                CookId={userData.id}
                OnCreated={RefreshListings}
                Disabled={isLoading}
            />

            {isLoading && <Loading/>}

            {orderMessage && <p role="status" style={messageStyle}>{orderMessage}</p>}

            <Listings
                ListingsData={listings}
                OnOrder={OpenOrderForm}
            />

            {selectedListing && (
                <OrderForm
                    IsOpen={true}
                    ListingTitle={selectedListing.title}
                    PickupDateTime={selectedListing.pickupDateTime}
                    PickupLocation={selectedListing.pickupLocation}
                    AvailablePortions={selectedListing.portions}
                    IsSaving={isOrdering}
                    OnConfirm={ConfirmOrder}
                    OnClose={CloseOrderForm}
                />
            )}

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default HomePage;
