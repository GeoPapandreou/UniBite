import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Rating from "@mui/material/Rating";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";

const ratingFormStyle = {
    width: "400px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "8px",
    boxSizing: "border-box"
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "24px",
    fontWeight: 600,
    textAlign: "left"
};

const ratingButtonsStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px"
};

const RatingForm = ({
    IsOpen,
    ListingTitle,
    IsSaving = false,
    OnConfirm,
    OnClose
}) => {
    // null means no star has been selected yet; submitting requires a whole number from 1 to 5.
    const [rating, setRating] = useState(null);
    const isFormValid = Number.isInteger(rating) && rating >= 1 && rating <= 5;

    const CloseRatingForm = () => {
        if(IsSaving) return;

        setRating(null);
        OnClose();
    };

    const ConfirmRating = () => {
        if(!isFormValid || IsSaving) return;


        OnConfirm({Rating: rating});
        // The parent closes the form after the rating is saved successfully.
    };

    return(
        <Dialog open={IsOpen} onClose={CloseRatingForm} aria-labelledby="rating-title">
            <DialogContent>
                <div className="ratingForm" style={ratingFormStyle}>
                    <h2 id="rating-title" style={titleStyle}>Rate {ListingTitle}</h2>

                    <Rating
                        name="order-rating"
                        value={rating}
                        max={5}
                        precision={1}
                        size="large"
                        style={{color: `#${Constants.LightBlue}`}}
                        onChange={(event, Value) => setRating(Value)}
                        disabled={IsSaving}
                    />

                    <div style={ratingButtonsStyle}>
                        <TextButton
                            Text="Cancel"
                            OnClick={CloseRatingForm}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Gray}
                            IsRaised={false}
                            Disabled={IsSaving}
                        />
                        <TextButton
                            Text={IsSaving ? "Sending..." : "Submit"}
                            OnClick={ConfirmRating}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Green}
                            IsRaised={false}
                            Disabled={!isFormValid || IsSaving}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RatingForm;
