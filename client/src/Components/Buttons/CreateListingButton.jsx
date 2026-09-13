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
            const photo = await Helpers.ReadListingPhoto(ListingData.Photo);

            const response = await fetch("/api/Unibite/listings", {
                method: "POST",
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
                actionInProgress.current = false;
                setIsSaving(false);
                return;
            }

            // Do not offer Create again when the listing itself was already saved.
            setErrorMessage(`Listing ${listingId} was saved, but some allergens could not be saved. Do not create it again.`);
        }

        setIsCreateListingOpen(false);

        try {
            await OnCreated();
        }
        catch {
            setErrorMessage(Message => Message || "The listing was saved, but the list could not refresh. Please refresh the page.");
        }
        finally {
            actionInProgress.current = false;
            setIsSaving(false);
        }
    };

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
