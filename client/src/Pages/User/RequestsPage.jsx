import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Requests from "../../Components/Cards/Requests";
import RatingForm from "../../Components/Cards/RatingForm";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";
import MessageDialog from "../../Components/Dialogs/MessageDialog";

const requestsPageStyle = {
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

/**
 ** Gets sent and incoming requests with the listing title and requester name
 */
const GetRequests = async(CurrentUserId) => {
    // fetch GET loads requests and the related data needed for names, listings and ratings.
    const [requests, listings, users, ratings] = await Promise.all([
        fetch("/api/Unibite/requests").then(Response => Response.json()),
        fetch("/api/Unibite/listings").then(Response => Response.json()),
        fetch("/api/Unibite/users").then(Response => Response.json()),
        fetch("/api/Unibite/ratings").then(Response => Response.json())
    ]);

    return requests.map(Request => {
        const listing = listings.find(Listing => Listing.id === Request.listingId);
        const requester = users.find(User => User.id === Request.consumerId);
        const rating = ratings.find(Rating => Rating.requestId === Request.id);

        return {
            ...Request,
            cookId: listing?.cookId,
            listingTitle: listing?.title,
            pickupLocation: listing?.pickupLocation,
            ratingValue: rating ? Number(rating.rating) : null,
            requesterName: requester ? `${requester.firstName} ${requester.lastName}` : "Unknown user"
        };
    }).filter(Request => Request.consumerId === CurrentUserId || Request.cookId === CurrentUserId);
};

const RequestsPage = () => {
    const location = useLocation();

    const userData = location.state.userData;
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    const [requestToRate, setRequestToRate] = useState(null);
    const decisionInProgress = useRef(false);

    useEffect(() => {
        GetRequests(userData.id)
            .then(RequestsData => setRequests(RequestsData))
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    }, [userData.id]);

    // Close an open rating form when its 48-hour window ends.
    useEffect(() => {
        if(!requestToRate) return;

        const deadline = new Date(requestToRate.dateCollected).getTime() + 48 * 60 * 60 * 1000;
        const timer = setTimeout(() => setRequestToRate(null), Math.max(0, deadline - Date.now()));
        return () => clearTimeout(timer);
    }, [requestToRate]);

    /**
     ** Saves the cook's decision and reloads the requests
     */
    const UpdateRequestApproval = async(Request, IsApproved) => {
        // Block another click immediately while the current decision is being saved.
        if(decisionInProgress.current) return;

        decisionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // fetch PATCH sends accept/decline as JSON; the backend updates portions or refunds credits.
            const response = await fetch(`/api/Unibite/requests/${Request.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cookId: userData.id, isApproved: IsApproved})
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not save the decision. Please try again.");

            // React state updates the card without a page reload, even if the next GET fails.
            setRequests(RequestsData => RequestsData.map(Item => Item.id === Request.id
                ? {...Item, isApproved: IsApproved ? 1 : 0}
                : Item
            ));

            try {
                setRequests(await GetRequests(userData.id));
            }
            catch {
                setErrorMessage("The decision was saved, but the requests could not refresh. Please refresh the page.");
            }
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            decisionInProgress.current = false;
            setIsSaving(false);
        }
    };

    const AcceptRequest = (Request) => UpdateRequestApproval(Request, true);
    const DeclineRequest = (Request) => UpdateRequestApproval(Request, false);

    /**
     ** Saves collection or a no show and refreshes the request cards
     */
    const UpdateRequestDelivery = async(Request, IsDelivered) => {
        if(decisionInProgress.current) return;

        decisionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // fetch PATCH records collection or no-show; credit changes are calculated by the backend.
            const response = await fetch(`/api/Unibite/requests/${Request.id}/delivery`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cookId: userData.id, isDelivered: IsDelivered})
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not save the collection outcome. Please try again.");

            // Keep the saved outcome even if the following refresh fails.
            setRequests(RequestsData => RequestsData.map(Item => Item.id === Request.id
                ? {...Item, isDelivered: IsDelivered ? 1 : 0}
                : Item
            ));

            try {
                setRequests(await GetRequests(userData.id));
            }
            catch {
                setErrorMessage("The outcome was saved, but the requests could not refresh. Please refresh the page.");
            }
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            decisionInProgress.current = false;
            setIsSaving(false);
        }
    };

    const CollectRequest = (Request) => UpdateRequestDelivery(Request, true);
    const MarkNoShow = (Request) => UpdateRequestDelivery(Request, false);

    const OpenRatingForm = (Request) => {
        const collectionTime = new Date(Request.dateCollected).getTime();
        if(!Request.dateCollected || !Number.isFinite(collectionTime) || collectionTime > Date.now() ||
            Date.now() >= collectionTime + 48 * 60 * 60 * 1000) return;

        if(decisionInProgress.current || Request.consumerId !== userData.id ||
            Number(Request.isApproved) !== 1 || Number(Request.isDelivered) !== 1 || Request.ratingValue !== null) return;

        setRequestToRate(Request);
    };

    const CloseRatingForm = () => {
        if(decisionInProgress.current) return;
        setRequestToRate(null);
    };

    /**
     ** Saves the requester's rating and refreshes the cards without a page reload
     */
    const ConfirmRating = async(RatingData) => {
        if(decisionInProgress.current || !requestToRate) return;

        const requestId = requestToRate.id;
        decisionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            // fetch POST sends the selected stars; a rating of 4 or 5 gives the cook a bonus credit.
            const response = await fetch("/api/Unibite/ratings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    requestId: requestId,
                    consumerId: userData.id,
                    rating: RatingData.Rating
                })
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not save your rating. Please try again.");

            // Keep the saved rating even if the following refresh fails.
            setRequests(RequestsData => RequestsData.map(Request => Request.id === requestId
                ? {...Request, ratingValue: RatingData.Rating}
                : Request
            ));
            setRequestToRate(null);

            try {
                setRequests(await GetRequests(userData.id));
            }
            catch {
                setErrorMessage("Your rating was saved, but the requests could not refresh. Please open the page again.");
            }
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            decisionInProgress.current = false;
            setIsSaving(false);
        }
    };

    const CancelRequest = (Request) => {
        if(decisionInProgress.current) return;
        setRequestToCancel(Request);
    };

    const CloseCancelDialog = () => setRequestToCancel(null);

    /**
     ** Deletes the confirmed pending request and reloads the requests
     */
    const ConfirmCancelRequest = async() => {
        if(decisionInProgress.current || !requestToCancel) return;

        const requestId = requestToCancel.id;
        decisionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");
        CloseCancelDialog();

        try {
            // fetch DELETE cancels a pending request and asks the backend to refund its reserved credits.
            const response = await fetch(`/api/Unibite/requests/${requestId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({consumerId: userData.id})
            });

            const result = await response.json();
            if(!response.ok) throw new Error(result.message || "Could not cancel the request. Please try again.");

            setRequests(RequestsData => RequestsData.filter(Request => Request.id !== requestId));

            try {
                setRequests(await GetRequests(userData.id));
            }
            catch {
                setErrorMessage("The request was cancelled, but the requests could not refresh. Please refresh the page.");
            }
        }
        catch(error) {
            setErrorMessage(error.message);
        }
        finally {
            decisionInProgress.current = false;
            setIsSaving(false);
        }
    };

    return(
        <div className="requestsPage" style={requestsPageStyle}>
            <h1 style={titleStyle}>Requests</h1>

            {isLoading ? <Loading/> : errorMessage === "" && (
                <>
                    <h2 style={{...titleStyle, fontSize: "24px"}}>My requests</h2>
                    <Requests
                        RequestsData={requests.filter(Request => Request.consumerId === userData.id)}
                        CurrentUserId={userData.id}
                        IsSaving={isSaving}
                        OnCancel={CancelRequest}
                        OnRate={OpenRatingForm}
                    />

                    <h2 style={{...titleStyle, fontSize: "24px"}}>Incoming requests</h2>
                    <Requests
                        RequestsData={requests.filter(Request => Request.cookId === userData.id)}
                        CurrentUserId={userData.id}
                        IsSaving={isSaving}
                        OnAccept={AcceptRequest}
                        OnDecline={DeclineRequest}
                        OnCollected={CollectRequest}
                        OnNoShow={MarkNoShow}
                    />
                </>
            )}

            {requestToRate && (
                <RatingForm
                    key={requestToRate.id}
                    IsOpen={true}
                    ListingTitle={requestToRate.listingTitle}
                    IsSaving={isSaving}
                    OnConfirm={ConfirmRating}
                    OnClose={CloseRatingForm}
                />
            )}

            <MessageDialog
                Title="Cancel request"
                Text="Are you sure you want to cancel this request?"
                IsOpen={requestToCancel !== null}
                IsOpenHandler={CloseCancelDialog}
                YesOnClick={ConfirmCancelRequest}
                NoOnClick={CloseCancelDialog}
            />

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default RequestsPage;
