import { useEffect, useRef, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";
import TextInput from "../Inputs/TextInput";

const createListingStyle = {
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

const labelStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "16px",
    textAlign: "left"
};

const mapStyle = {
    width: "100%",
    height: "280px",
    borderRadius: "8px"
};

const photoPreviewStyle = {
    width: "160px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px"
};

const listingButtonsStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px"
};

// The marker listens for clicks inside the map.
const PickupMarker = ({Position, OnPositionChanged}) => {
    useMapEvents({
        click(event) {
            const position = event.latlng.wrap();

            OnPositionChanged({
                Latitude: position.lat,
                Longitude: position.lng
            });
        }
    });

    return Position === null ? null : (
        <CircleMarker
            center={[Position.Latitude, Position.Longitude]}
            radius={9}
            interactive={false}
            pathOptions={{
                color: `#${Constants.White}`,
                fillColor: `#${Constants.Green}`,
                fillOpacity: 1,
                weight: 3
            }}
        />
    );
};

const CreateListing = ({
    IsOpen,
    AllergensData = [],
    IsSaving = false,
    OnConfirm,
    OnClose
}) => {
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [pickupAvailability, setPickupAvailability] = useState("");
    const [portions, setPortions] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [pickupPosition, setPickupPosition] = useState(null);
    const [selectedAllergens, setSelectedAllergens] = useState([]);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photo, setPhoto] = useState(null);
    const photoInput = useRef(null);

    // Release the previous preview when it changes or the form closes.
    useEffect(() => {
        return () => {
            if(photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const isFormValid = title.trim() !== "" && title.trim().length <= 120 &&
        notes.trim() !== "" &&
        Number.isSafeInteger(Number(portions)) && Number(portions) > 0 &&
        pickupLocation.trim() !== "" && pickupLocation.trim().length <= 255 &&
        pickupPosition !== null;

    const ChangePhoto = (event) => {
        const photo = event.target.files[0];

        if(photo) {
            setPhoto(photo);
            setPhotoPreview(URL.createObjectURL(photo));
        }
    };

    const ChangePortions = (event) => {
        const newPortions = event.target.value;

        if(newPortions === "" || /^[0-9]+$/.test(newPortions)) {
            setPortions(newPortions);
        }
    };

    const ChangeAllergen = (AllergenId) => {
        setSelectedAllergens(Allergens => Allergens.includes(AllergenId)
            ? Allergens.filter(Id => Id !== AllergenId)
            : [...Allergens, AllergenId]
        );
    };

    const CloseCreateListing = () => {
        if(IsSaving) {
            return;
        }

        setTitle("");
        setNotes("");
        setPickupAvailability("");
        setPortions("");
        setPickupLocation("");
        setPickupPosition(null);
        setSelectedAllergens([]);
        setPhotoPreview("");
        setPhoto(null);
        if(photoInput.current) {
            photoInput.current.value = "";
        }
        OnClose();
    };

    const ConfirmListing = () => {
        if(!isFormValid || IsSaving) {
            return;
        }

        // The parent saves the listing and closes the form on success.
        OnConfirm({
            Title: title.trim(),
            Notes: notes.trim(),
            PickupAvailability: pickupAvailability.trim() || null,
            Photo: photo,
            Portions: Number(portions),
            PickupLocation: pickupLocation.trim(),
            Latitude: pickupPosition.Latitude,
            Longitude: pickupPosition.Longitude,
            AllergenIds: selectedAllergens
        });

    };

    return(
        <Dialog open={IsOpen} onClose={CloseCreateListing} aria-labelledby="createListingTitle">
            <DialogContent>
                <div className="createListing" style={createListingStyle}>
                    <h2 id="createListingTitle" style={titleStyle}>Create listing</h2>

                    <TextInput
                        Text={title}
                        OnTextChanged={(event) => setTitle(event.target.value)}
                        Hint="Food name"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                    />

                    <TextInput
                        Text={notes}
                        OnTextChanged={(event) => setNotes(event.target.value)}
                        Hint="Food description"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                        Multiline={true}
                        Rows={2}
                    />

                    <TextInput
                        Text={portions}
                        OnTextChanged={ChangePortions}
                        Hint="Available portions"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                    />

                    <input
                        ref={photoInput}
                        type="file"
                        accept="image/*"
                        onChange={ChangePhoto}
                        hidden
                    />
                    <TextButton
                        Text="Choose photo (optional)"
                        OnClick={() => photoInput.current.click()}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Gray}
                        IsRaised={false}
                    />

                    {photoPreview && (
                        <img src={photoPreview} alt="Selected food preview" style={photoPreviewStyle}/>
                    )}

                    <div>
                        <p style={labelStyle}>Allergens</p>

                        {AllergensData.length === 0 && (
                            <p style={labelStyle}>No allergen options available.</p>
                        )}

                        {AllergensData.map(Allergen => (
                            <FormControlLabel
                                key={Allergen.id}
                                control={
                                    <Checkbox
                                        checked={selectedAllergens.includes(Allergen.id)}
                                        onChange={() => ChangeAllergen(Allergen.id)}
                                        style={{color: `#${Constants.LightBlue}`}}
                                    />
                                }
                                label={<span style={labelStyle}>{Allergen.name}</span>}
                            />
                        ))}
                    </div>

                    <TextInput
                        Text={pickupLocation}
                        OnTextChanged={(event) => setPickupLocation(event.target.value)}
                        Hint="Pickup location"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                    />

                    <MapContainer
                        center={[38.7, 23.5]}
                        zoom={6}
                        scrollWheelZoom={false}
                        style={mapStyle}>
                        <TileLayer
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <PickupMarker
                            Position={pickupPosition}
                            OnPositionChanged={setPickupPosition}
                        />
                    </MapContainer>

                    <TextInput
                        Text={pickupAvailability}
                        OnTextChanged={(event) => setPickupAvailability(event.target.value)}
                        Hint="Pickup availability"
                        HasFloatingHint={true}
                        HasFullWidth={true}
                        Multiline={true}
                        Rows={2}
                    />

                    <div style={listingButtonsStyle}>
                        <TextButton
                            Text="Cancel"
                            OnClick={CloseCreateListing}
                            BorderRadius="8px"
                            Color={Constants.White}
                            BackColor={Constants.Gray}
                            IsRaised={false}
                            Disabled={IsSaving}
                        />
                        <TextButton
                            Text={IsSaving ? "Saving..." : "Create"}
                            OnClick={ConfirmListing}
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

export default CreateListing;
