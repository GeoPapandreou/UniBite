import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Helpers from "../../Shared/Helpers";
import CreateListingButton from "../../Components/Buttons/CreateListingButton";
import CreateListing from "../../Components/Cards/CreateListing";
import Listings from "../../Components/Cards/Listings";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

const myListingsPageStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
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

const GetListingStatus = (Listing) => {
    if(Date.now() - new Date(Listing.dateCreated).getTime() >= 48 * 60 * 60 * 1000) return "Expired";
    if(Number(Listing.portions) <= 0) return "Sold out";
    return Number(Listing.isActive) === 1 ? "Active" : "Inactive";
};

const GetListingPhoto = (Listing) => Listing.photo?.type === "Buffer"
    ? new TextDecoder().decode(new Uint8Array(Listing.photo.data)) : Listing.photo;

/**
 ** Gets the user's own listings, including sold-out and expired listings
 */
const GetMyListings = async(CurrentUserId) => {
    const responses = await Promise.all([
        fetch("/api/Unibite/listings"),
        fetch("/api/Unibite/listingAllergens"),
        fetch("/api/Unibite/allergens")
    ]);

    if(responses.some(Response => !Response.ok)) {
        throw new Error("Could not load your listings. Please open the page again.");
    }

    const [listings, listingAllergens, allergens] = await Promise.all(
        responses.map(Response => Response.json())
    );

    return listings.filter(Listing => Number(Listing.cookId) === Number(CurrentUserId)).map(Listing => ({
        ...Listing,
        status: GetListingStatus(Listing),
        // Decode the stored photo in the same way as the homepage.
        photo: GetListingPhoto(Listing),
        allergens: allergens.filter(Allergen => listingAllergens.some(Link =>
            Link.listingId === Listing.id && Link.allergensId === Allergen.id
        ))
    }));
};

const MyListingsPage = () => {
    const location = useLocation();
    const userData = location.state.userData;

    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingListing, setEditingListing] = useState(null);
    const [allergens, setAllergens] = useState([]);
    const [pickupDetailsLocked, setPickupDetailsLocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const editInProgress = useRef(false);

    useEffect(() => {
        let isMounted = true;

        GetMyListings(userData.id)
            .then(ListingsData => {
                if(isMounted) setListings(ListingsData);
            })
            .catch(error => {
                if(isMounted) setErrorMessage(error.message);
            })
            .finally(() => {
                if(isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [userData.id]);

    /**
     ** Refreshes the user's cards after a listing is created
     */
    const RefreshListings = async() => {
        setListings(await GetMyListings(userData.id));
        setErrorMessage("");
    };

    /**
     ** Opens the existing form with the latest listing and selected allergens
     */
    const OpenEditListing = async(Listing) => {
        if(editInProgress.current) return;
        editInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            const responses = await Promise.all([
                fetch(`/api/Unibite/listings/${Listing.id}`),
                fetch("/api/Unibite/allergens"),
                fetch("/api/Unibite/listingAllergens"),
                fetch("/api/Unibite/requests")
            ]);

            if(responses.some(Response => !Response.ok)) {
                throw new Error("Could not load this listing for editing. Please try again.");
            }

            const [listing, allergensData, links, requests] = await Promise.all(responses.map(Response => Response.json()));
            if(Number(listing.cookId) !== Number(userData.id)) {
                throw new Error("You can only edit your own listings.");
            }

            setAllergens(allergensData);
            setPickupDetailsLocked(requests.some(Request => Request.listingId === listing.id &&
                (Request.isApproved === null || (Number(Request.isApproved) === 1 && Request.isDelivered === null))));
            setEditingListing({
                ...listing,
                photo: GetListingPhoto(listing),
                allergens: allergensData.filter(Allergen => links.some(Link => Link.listingId === listing.id && Link.allergensId === Allergen.id))
            });
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            editInProgress.current = false;
            setIsSaving(false);
        }
    };

    const CloseEditListing = () => {
        if(editInProgress.current) return;
        setEditingListing(null);
    };

    /**
     ** Saves the listing and its allergens, then updates the cards without a reload
     */
    const ConfirmEditListing = async(ListingData) => {
        if(editInProgress.current || !editingListing) return;
        editInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // Omit photo when unchanged so the backend preserves the stored image.
            const photo = ListingData.Photo ? await Helpers.ReadListingPhoto(ListingData.Photo) : undefined;
            const response = await fetch(`/api/Unibite/listings/${editingListing.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    cookId: userData.id,
                    title: ListingData.Title,
                    notes: ListingData.Notes,
                    portions: ListingData.Portions,
                    pickupLocation: ListingData.PickupLocation,
                    latitude: ListingData.Latitude,
                    longitude: ListingData.Longitude,
                    pickupDateTime: ListingData.PickupDateTime,
                    photo: photo,
                    allergenIds: ListingData.AllergenIds,
                    originalPortions: Number(editingListing.portions),
                    originalDateUpdated: editingListing.dateUpdated
                })
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not save the listing. Please try again.");
            }

            const updatedListing = await response.json();
            setListings(ListingsData => ListingsData.map(Listing => Listing.id === updatedListing.id ? {
                ...updatedListing,
                status: GetListingStatus(updatedListing),
                photo: GetListingPhoto(updatedListing),
                allergens: allergens.filter(Allergen => ListingData.AllergenIds.includes(Allergen.id))
            } : Listing));
            setEditingListing(null);

            try {
                await RefreshListings();
            }
            catch {
                setErrorMessage("The listing was saved, but the list could not refresh. Please open the page again.");
            }
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            editInProgress.current = false;
            setIsSaving(false);
        }
    };

    return(
        <div className="myListingsPage" style={myListingsPageStyle}>
            <h1 style={titleStyle}>My Listings</h1>

            <CreateListingButton
                CookId={userData.id}
                OnCreated={RefreshListings}
                Disabled={isLoading || isSaving || editingListing !== null}
            />

            {isLoading ? <Loading/> : errorMessage === "" && (
                <Listings ListingsData={listings} OnEdit={OpenEditListing} IsSaving={isSaving}/>
            )}

            {editingListing && (
                <CreateListing
                    key={editingListing.id}
                    IsOpen={true}
                    InitialListing={editingListing}
                    AllergensData={allergens}
                    PickupDetailsLocked={pickupDetailsLocked}
                    IsSaving={isSaving}
                    OnConfirm={ConfirmEditListing}
                    OnClose={CloseEditListing}
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

export default MyListingsPage;
