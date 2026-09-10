import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";

const requestCardStyle = {
    width: "100%",
    maxWidth: "350px",
    borderRadius: "12px",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow
};

const requestContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px"
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "24px",
    fontWeight: 600,
    textAlign: "left"
};

const requestInformationStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "16px",
    textAlign: "left"
};

const requestButtonsStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "8px"
};

const RequestCard = ({
    ListingTitle,
    RequesterName,
    Portions = 1,
    IsListingOwner = false,
    OnAccept,
    OnDecline,
    OnCancel
}) => {
    return(
        <Card style={requestCardStyle}>
            <CardContent style={requestContentStyle}>
                <h2 style={titleStyle}>{ListingTitle}</h2>

                <p style={requestInformationStyle}>
                    Requested by: {RequesterName}
                </p>

                <p style={requestInformationStyle}>
                    Portions: {Portions}
                </p>

                <div style={requestButtonsStyle}>
                    {IsListingOwner ? (
                        <>
                            <TextButton
                                Text="Accept"
                                OnClick={OnAccept}
                                BorderRadius="8px"
                                Color={Constants.White}
                                BackColor={Constants.Green}
                                IsRaised={false}
                            />
                            <TextButton
                                Text="Decline"
                                OnClick={OnDecline}
                                BorderRadius="8px"
                                Color={Constants.White}
                                BackColor={Constants.Red}
                                IsRaised={false}
                            />
                        </>
                    ) : (
                        <TextButton
                            Text="Cancel"
                            OnClick={OnCancel}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Gray}
                            IsRaised={false}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RequestCard;
