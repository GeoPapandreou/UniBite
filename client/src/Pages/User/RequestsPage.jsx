import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Constants from "../../Shared/Constants";
import Requests from "../../Components/Cards/Requests";
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
    const responses = await Promise.all([
        fetch("/api/Unibite/requests"),
        fetch("/api/Unibite/listings"),
        fetch("/api/Unibite/users")
    ]);

    if(responses.some(Response => !Response.ok)) {
        throw new Error("Could not load the requests. Please refresh the page.");
    }

    const [requests, listings, users] = await Promise.all(
        responses.map(Response => Response.json())
    );

    return requests.map(Request => {
        const listing = listings.find(Listing => Listing.id === Request.listingId);
        const requester = users.find(User => User.id === Request.consumerId);

        return {
            ...Request,
            cookId: listing?.cookId,
            listingTitle: listing?.title,
            pickupLocation: listing?.pickupLocation,
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
    const decisionInProgress = useRef(false);

    useEffect(() => {
        let isMounted = true;

        GetRequests(userData.id)
            .then(RequestsData => {
                if(isMounted) setRequests(RequestsData);
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
     ** Saves the cook's decision and reloads the requests
     */
    const UpdateRequestApproval = async(Request, IsApproved) => {
        if(decisionInProgress.current) return;

        decisionInProgress.current = true;
        setIsSaving(true);
        setErrorMessage("");

        try {
            const response = await fetch(`/api/Unibite/requests/${Request.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cookId: userData.id, isApproved: IsApproved})
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not save the decision. Please try again.");
            }

            // Keep the saved status even if the following refresh fails.
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
            const response = await fetch(`/api/Unibite/requests/${requestId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({consumerId: userData.id})
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Could not cancel the request. Please try again.");
            }

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
                    />

                    <h2 style={{...titleStyle, fontSize: "24px"}}>Incoming requests</h2>
                    <Requests
                        RequestsData={requests.filter(Request => Request.cookId === userData.id)}
                        CurrentUserId={userData.id}
                        IsSaving={isSaving}
                        OnAccept={AcceptRequest}
                        OnDecline={DeclineRequest}
                    />
                </>
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
