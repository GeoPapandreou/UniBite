import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import TextButton from "../../Components/Buttons/TextButton";
import Loading from "../../Components/Animations/Loading";
import CreateListing from "../../Components/Cards/CreateListing";
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
    const responses = await Promise.all([
        fetch("/api/Unibite/listings"),
        fetch("/api/Unibite/listingAllergens"),
        fetch("/api/Unibite/allergens"),
        fetch("/api/Unibite/users")
    ]);

    if(responses.some(Response => !Response.ok)) {
        throw new Error("Could not load the listings. Please refresh the page.");
    }

    const [listings, listingAllergens, allergens, users] = await Promise.all(
        responses.map(Response => Response.json())
    );

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
    const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
    const [allergens, setAllergens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
     ** Gets the available allergens before opening the create listing form
     */
    const OpenCreateListing = async() => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/Unibite/allergens");

            if(!response.ok) {
                throw new Error("Could not get the allergens. Please try again.");
            }

            const allergensData = await response.json();

            if(!Array.isArray(allergensData)) {
                throw new Error("Could not get the allergens. Please try again.");
            }

            setAllergens(allergensData);
            setIsCreateListingOpen(true);
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const CloseCreateListing = () => {
        setIsCreateListingOpen(false);
    };

    /**
     ** Saves the listing, then its selected allergens
     */
    const ConfirmCreateListing = async(ListingData) => {
        if(isSaving) return;

        setIsSaving(true);
        setErrorMessage("");
        let listingId = null;

        try {
            let photo = null;

            if(ListingData.Photo) {
                const prefix = `data:${ListingData.Photo.type};base64,`;

                // Base64 and its prefix must also fit in the current BLOB column.
                if(prefix.length + 4 * Math.ceil(ListingData.Photo.size / 3) > 65535) {
                    throw new Error("The photo is too large. Please choose an image smaller than 48 KB.");
                }

                const bytes = new Uint8Array(await ListingData.Photo.arrayBuffer());
                photo = prefix + btoa(Array.from(bytes, Byte => String.fromCharCode(Byte)).join(""));
            }

            const response = await fetch("/api/Unibite/listings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    cookId: userData.id,
                    title: ListingData.Title,
                    notes: ListingData.Notes,
                    pickupDateTime: ListingData.PickupDateTime,
                    photo: photo,
                    portions: ListingData.Portions,
                    pickupLocation: ListingData.PickupLocation,
                    latitude: ListingData.Latitude,
                    longitude: ListingData.Longitude,
                    isActive: true
                })
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not save the listing. Please check that the backend is running.");
            }

            const result = await response.json();
            listingId = result.insertId;

            for(const AllergenId of ListingData.AllergenIds) {
                const allergenResponse = await fetch("/api/Unibite/listingAllergens", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({listingId: listingId, allergensId: AllergenId})
                });

                if(!allergenResponse.ok) {
                    throw new Error("Could not save the selected allergens.");
                }
            }
        }
        catch(error) {
            if(listingId === null) {
                setErrorMessage(error.message);
                setIsSaving(false);
                return;
            }

            // Do not offer Create again when the listing itself was already saved.
            setErrorMessage(`Listing ${listingId} was saved, but some allergens could not be saved. Do not create it again.`);
        }

        CloseCreateListing();

        try {
            setListings(await GetListings(userData.universityId));
        }
        catch {
            setErrorMessage(Message => Message || "The listing was saved, but the list could not refresh. Please refresh the page.");
        }
        finally {
            setIsSaving(false);
        }
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

            <TextButton
                Text="Create listing"
                OnClick={OpenCreateListing}
                BorderRadius="8px"
                Color={Constants.White}
                BackColor={Constants.Green}
                IsRaised={false}
                Disabled={isLoading || isSaving}
            />

            {isLoading && <Loading/>}

            {orderMessage && <p role="status" style={messageStyle}>{orderMessage}</p>}

            <Listings
                ListingsData={listings}
                OnOrder={OpenOrderForm}
            />

            {isCreateListingOpen && (
                <CreateListing
                    IsOpen={true}
                    AllergensData={allergens}
                    IsSaving={isSaving}
                    OnConfirm={ConfirmCreateListing}
                    OnClose={CloseCreateListing}
                />
            )}

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
