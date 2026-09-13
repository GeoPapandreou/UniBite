import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Listings from "../../Components/Cards/Listings";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";
import MessageDialog from "../../Components/Dialogs/MessageDialog";

const listingsPageStyle = {
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

/**
 ** Gets all stored listings for the admin, including expired listings
 */
const GetListings = async() => {
    // fetch GET loads all listings for admin review; expired listings are not filtered out here.
    const responses = await Promise.all([
        fetch("/api/Unibite/listings"),
        fetch("/api/Unibite/listingAllergens"),
        fetch("/api/Unibite/allergens")
    ]);

    if(responses.some(Response => !Response.ok)) {
        throw new Error("Could not load the listings. Please open the page again.");
    }

    const [listings, listingAllergens, allergens] = await Promise.all(
        responses.map(Response => Response.json())
    );

    return listings.map(Listing => ({
        ...Listing,
        status: Date.now() - new Date(Listing.dateCreated).getTime() >= 48 * 60 * 60 * 1000
            ? "Expired"
            : Number(Listing.portions) <= 0 ? "Sold out" : Number(Listing.isActive) === 1 ? "Active" : "Inactive",
        // Decode the stored photo in the same way as the user's homepage.
        photo: Listing.photo?.type === "Buffer"
            ? new TextDecoder().decode(new Uint8Array(Listing.photo.data))
            : Listing.photo,
        allergens: allergens.filter(Allergen => listingAllergens.some(Link =>
            Link.listingId === Listing.id && Link.allergensId === Allergen.id
        ))
    }));
};

const ListingsPage = () => {
    const location = useLocation();
    const adminData = location.state.adminData;

    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [deletingListing, setDeletingListing] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const actionInProgress = useRef(false);

    useEffect(() => {
        let isMounted = true;

        GetListings()
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
    }, []);

    const OpenDeleteListing = (Listing) => {
        if(actionInProgress.current) return;
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
            // fetch DELETE uses the same refund/deletion flow as My Listings, with an admin ID.
            const response = await fetch(`/api/Unibite/listings/${deletingListing.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({adminId: adminData.id})
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not delete the listing. Please try again.");
            }

            // Update the displayed cards without reloading the page after a successful deletion.
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
        <div className="adminListingsPage" style={listingsPageStyle}>
            <h1 style={titleStyle}>All Listings</h1>

            {isLoading ? <Loading/> : errorMessage === "" && (
                <Listings ListingsData={listings} OnDelete={OpenDeleteListing} IsSaving={isSaving}/>
            )}

            <MessageDialog
                Text="Are you sure?"
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

export default ListingsPage;
