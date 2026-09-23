import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Helpers from "../../Shared/Helpers";
import CreateListingButton from "../../Components/Buttons/CreateListingButton";
import CreateListing from "../../Components/Cards/CreateListing";
import Listings from "../../Components/Cards/Listings";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";
import MessageDialog from "../../Components/Dialogs/MessageDialog";

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
    // fetch GET loads the owner's cards, including listings hidden from the public feed by expiry.
    const [listings, listingAllergens, allergens] = await Promise.all([
        fetch("/api/Unibite/listings").then(Response => Response.json()),
        fetch("/api/Unibite/listingAllergens").then(Response => Response.json()),
        fetch("/api/Unibite/allergens").then(Response => Response.json())
    ]);

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
    const [deletingListing, setDeletingListing] = useState(null);
    const [allergens, setAllergens] = useState([]);
    const [pickupDetailsLocked, setPickupDetailsLocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const actionInProgress = useRef(false);

    useEffect(() => {
        GetMyListings(userData.id)
            .then(ListingsData => setListings(ListingsData))
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
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
        if(actionInProgress.current || deletingListing) return;
        actionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // Reload current details before editing; requests determine whether pickup fields are locked.
            // GET /listings/:id calls GetListingById; the other URLs call their GetAll controllers.
            const [listing, allergensData, links, requests] = await Promise.all([
                fetch(`/api/Unibite/listings/${Listing.id}`).then(Response => Response.json()),
                fetch("/api/Unibite/allergens").then(Response => Response.json()),
                fetch("/api/Unibite/listingAllergens").then(Response => Response.json()),
                fetch("/api/Unibite/requests").then(Response => Response.json())
            ]);

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
            actionInProgress.current = false;
            setIsSaving(false);
        }
    };

    const CloseEditListing = () => {
        if(actionInProgress.current) return;
        setEditingListing(null);
    };

    /**
     ** Saves the listing and its allergens, then updates the cards without a reload
     */
    const ConfirmEditListing = async(ListingData) => {
        if(actionInProgress.current || !editingListing) return;
        actionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            const photo = ListingData.Photo ? await Helpers.ReadListingPhoto(ListingData.Photo) : undefined;
            // fetch PUT saves the edited details and selected allergen IDs together in the backend.
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

            const updatedListing = await response.json();
            if(!response.ok) throw new Error(updatedListing.message || "Could not save the listing. Please try again.");

            // map replaces only the matching card; spreading updatedListing copies the returned fields.
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
            actionInProgress.current = false;
            setIsSaving(false);
        }
    };

    const OpenDeleteListing = (Listing) => {
        if(actionInProgress.current || editingListing) return;
        setErrorMessage("");
        setDeletingListing(Listing);
    };

    const CloseDeleteListing = () => {
        if(actionInProgress.current) return;
        setDeletingListing(null);
    };

    /**
     ** Deletes the confirmed listing and removes its card without reloading the page
     */
    const ConfirmDeleteListing = async() => {
        if(actionInProgress.current || !deletingListing) return;
        actionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // fetch DELETE removes the listing and any related requests.
            const response = await fetch(`/api/Unibite/listings/${deletingListing.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cookId: userData.id})
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not delete the listing. Please try again.");

            // Remove the card only after the API confirms deletion.
            setListings(ListingsData => ListingsData.filter(Listing => Listing.id !== deletingListing.id));
            setDeletingListing(null);
        }
        catch(error) {
            setDeletingListing(null);
            setErrorMessage(error.message);
        }
        finally {
            actionInProgress.current = false;
            setIsSaving(false);
        }
    };

    return(
        <div className="myListingsPage" style={myListingsPageStyle}>
            <h1 style={titleStyle}>My Listings</h1>

            <CreateListingButton
                CookId={userData.id}
                OnCreated={RefreshListings}
                Disabled={isLoading || isSaving || editingListing !== null || deletingListing !== null}
            />

            {isLoading ? <Loading/> : errorMessage === "" && (
                <Listings ListingsData={listings} 
                OnEdit={OpenEditListing} 
                OnDelete={OpenDeleteListing} 
                IsSaving={isSaving}/>
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

            <MessageDialog
                Text={`Are you sure?`}
                Color={Constants.Red}
                IsOpen={deletingListing !== null}
                IsOpenHandler={CloseDeleteListing}
                YesOnClick={ConfirmDeleteListing}
                NoOnClick={CloseDeleteListing}
                IsSaving={isSaving}
            />

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default MyListingsPage;
