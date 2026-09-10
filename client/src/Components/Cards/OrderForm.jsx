import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";
import SingleDatePicker from "../DateTimePickers/SingleDatePicker";
import SingleTimePicker from "../DateTimePickers/SingleTimePicker";
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
    AvailablePortions = 1,
    OnConfirm,
    OnClose
}) => {
    const [portions, setPortions] = useState("");
    const [pickupDate, setPickupDate] = useState(null);
    const [pickupTime, setPickupTime] = useState(null);

    const isFormValid = Number(portions) > 0 &&
        Number(portions) <= AvailablePortions &&
        pickupDate !== null &&
        pickupTime !== null;

    const ChangePortions = (event) => {
        const newPortions = event.target.value;

        if(newPortions === "" || /^[0-9]+$/.test(newPortions)) {
            setPortions(newPortions);
        }
    };

    const CloseOrderForm = () => {
        setPortions("");
        setPickupDate(null);
        setPickupTime(null);
        OnClose();
    };

    const ConfirmOrder = () => {
        OnConfirm({
            Portions: Number(portions),
            PickupDate: pickupDate,
            PickupTime: pickupTime
        });

        CloseOrderForm();
    };

    return(
        <Dialog open={IsOpen} onClose={CloseOrderForm}>
            <DialogContent>
                <div className="orderForm" style={orderFormStyle}>
                    <h2 style={titleStyle}>Order {ListingTitle}</h2>

                    <p style={availablePortionsStyle}>
                        Available portions: {AvailablePortions}
                    </p>

                    <TextInput
                        Text={portions}
                        OnTextChanged={ChangePortions}
                        Hint="Portions"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                    />

                    <SingleDatePicker OnDateChanged={setPickupDate}/>
                    <SingleTimePicker OnTimeChanged={setPickupTime}/>

                    <div style={orderButtonsStyle}>
                        <TextButton
                            Text="Cancel"
                            OnClick={CloseOrderForm}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Gray}
                            IsRaised={false}
                        />
                        <TextButton
                            Text="Confirm"
                            OnClick={ConfirmOrder}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Green}
                            IsRaised={false}
                            Disabled={!isFormValid}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderForm;
