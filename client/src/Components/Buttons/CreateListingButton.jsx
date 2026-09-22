import { useRef, useState } from "react";

import Constants from "../../Shared/Constants";
import Helpers from "../../Shared/Helpers";
import TextButton from "./TextButton";
import Loading from "../Animations/Loading";
import CreateListing from "../Cards/CreateListing";
import ErrorDialog from "../Dialogs/ErrorDialog";

/**
 ** Shares the create button, form and saving flow between listing pages
 */
const CreateListingButton = ({
    CookId,
    OnCreated,
    Disabled = false
}) => {
    const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
    const [allergens, setAllergens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const actionInProgress = useRef(false);

    /**
     ** Gets the available allergens before opening the create listing form
     */
    const OpenCreateListing = async() => {
        if(Disabled || actionInProgress.current) return;
        actionInProgress.current = true;
        setIsLoading(true);
        setErrorMessage("");

        try {
            // fetch GET supplies the allergen choices from the database.
            const allergensData = await fetch("/api/Unibite/allergens").then(Response => Response.json());

            setAllergens(allergensData);
            setIsCreateListingOpen(true);
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            actionInProgress.current = false;
            setIsLoading(false);
        }
    };

    const CloseCreateListing = () => {
        if(actionInProgress.current) return;
        setIsCreateListingOpen(false);
    };

    /**
     ** Saves the listing, then its selected allergens
     */
    const ConfirmCreateListing = async(ListingData) => {
        if(actionInProgress.current) return;
        actionInProgress.current = true;

        setIsSaving(true);
        setErrorMessage("");

        let listingId = null;

        try {
            // Converts an optional File to JSON-friendly image text;
            const photo = await Helpers.ReadListingPhoto(ListingData.Photo);

            // fetch POST sends the form as JSON, including the optional photo converted to a data URL.
            const response = await fetch("/api/Unibite/listings", {
                method: "POST",
                // stringify turns the JavaScript object into JSON text.
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    cookId: CookId,
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

            // fetch gives an HTTP Response;
            const result = await response.json();
            // This check sends an unsuccessful response to catch.
            if(!response.ok) throw new Error(result.message || "Could not save the listing. Please check that the backend is running.");

            // Connects the next inserts to the listing just created.
            listingId = result.insertId;

            for(const AllergenId of ListingData.AllergenIds) {
                // Link each selected allergen to the new listing using its returned insertId.
                const allergenResponse = await fetch("/api/Unibite/listingAllergens", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({listingId: listingId, allergensId: AllergenId})
                });

                if(!allergenResponse.ok) throw new Error("Could not save the selected allergens.");
            }
        }
        catch(error) {
            if(listingId === null) {
                setErrorMessage(error.message);
                actionInProgress.current = false;
                setIsSaving(false);
                return;
            }

            // Do not offer Create again when the listing itself was already saved.
            setErrorMessage(`Listing ${listingId} was saved, but some allergens could not be saved. Do not create it again.`);
        }

        setIsCreateListingOpen(false);

        try {
            // HomePage/MyListingsPage supplied RefreshListings as OnCreated. It fetches the new cards.
            await OnCreated();
        }
        catch {
            setErrorMessage(Message => Message || "The listing was saved, but the list could not refresh. Please refresh the page.");
        }
        finally {
            // Always release the saving state, even if refreshing the cards failed.
            actionInProgress.current = false;
            setIsSaving(false);
        }
    };

    // The first button opens the form; the form's OnConfirm calls ConfirmCreateListing above.
    return(
        <>
            <TextButton
                Text="Create listing"
                OnClick={OpenCreateListing}
                BorderRadius="8px"
                Color={Constants.White}
                BackColor={Constants.Green}
                IsRaised={false}
                Disabled={Disabled || isLoading || isSaving}
            />

            {isLoading && <Loading/>}

            {isCreateListingOpen && (
                <CreateListing
                    IsOpen={true}
                    AllergensData={allergens}
                    IsSaving={isSaving}
                    OnConfirm={ConfirmCreateListing}
                    OnClose={CloseCreateListing}
                />
            )}

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </>
    );
};

export default CreateListingButton;
