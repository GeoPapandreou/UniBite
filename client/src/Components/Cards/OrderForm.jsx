import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";
import TextInput from "../Inputs/TextInput";

const orderFormStyle = {
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

const availablePortionsStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "16px",
    textAlign: "left"
};

const orderButtonsStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px"
};

const OrderForm = ({
    IsOpen,
    ListingTitle,
    PickupDateTime,
    PickupLocation,
    AvailablePortions = 1,
    IsSaving = false,
    OnConfirm,
    OnClose
}) => {
    const [portions, setPortions] = useState("");

    const isFormValid = Number(portions) > 0 &&
        Number(portions) <= AvailablePortions;

    const ChangePortions = (event) => {
        const newPortions = event.target.value;

        if(newPortions === "" || /^[0-9]+$/.test(newPortions)) {
            setPortions(newPortions);
        }
    };

    const CloseOrderForm = () => {
        if(IsSaving) return;

        setPortions("");
        OnClose();
    };

    const ConfirmOrder = () => {
        if(!isFormValid || IsSaving) {
            return;
        }

        OnConfirm({
            Portions: Number(portions)
        });

        // The parent closes the form after the request is saved successfully.
    };

    return(
        <Dialog open={IsOpen} onClose={CloseOrderForm}>
            <DialogContent>
                <div className="orderForm" style={orderFormStyle}>
                    <h2 style={titleStyle}> {ListingTitle}</h2>

                    <p style={availablePortionsStyle}>
                        Available portions: {AvailablePortions}
                    </p>

                    {PickupDateTime && (
                        <p style={availablePortionsStyle}>
                            Pickup: {new Date(PickupDateTime).toLocaleString()}
                        </p>
                    )}

                    {PickupLocation && (
                        <p style={availablePortionsStyle}>Pickup location: {PickupLocation}</p>
                    )}

                    <TextInput
                        Text={portions}
                        OnTextChanged={ChangePortions}
                        Hint="Portions"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                    />

                    <div style={orderButtonsStyle}>
                        <TextButton
                            Text="Cancel"
                            OnClick={CloseOrderForm}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Gray}
                            IsRaised={false}
                            Disabled={IsSaving}
                        />
                        <TextButton
                            Text={IsSaving ? "Sending..." : "Confirm"}
                            OnClick={ConfirmOrder}
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

export default OrderForm;
