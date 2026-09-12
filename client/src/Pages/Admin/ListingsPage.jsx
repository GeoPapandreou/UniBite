import { useEffect, useState } from "react";

import Constants from "../../Shared/Constants";
import Listings from "../../Components/Cards/Listings";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

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
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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

    return(
        <div className="adminListingsPage" style={listingsPageStyle}>
            <h1 style={titleStyle}>All Listings</h1>

            {isLoading ? <Loading/> : errorMessage === "" && (
                <Listings ListingsData={listings}/>
            )}

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default ListingsPage;
