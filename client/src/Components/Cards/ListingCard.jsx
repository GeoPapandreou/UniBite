import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Constants from "../../Shared/Constants";
import TextButton from "../Buttons/TextButton";
import AllergenChip from "../Chips/AllergenChip";

const listingCardStyle = {
    width: "100%",
    maxWidth: "350px",
    borderRadius: "12px",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow,
    overflow: "hidden"
};

const imageContainerStyle = {
    position: "relative"
};

const imageStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover"
};

const portionsStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "4px 12px",
    borderRadius: "16px",
    color: `#${Constants.White}`,
    fontFamily: Constants.FontFamily,
    fontWeight: 600
};

const listingContentStyle = {
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

const notesStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "16px",
    textAlign: "left"
};

const allergensStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
};

const orderButtonStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end"
};

const ListingCard = ({
    ImageSource,
    Title,
    Notes,
    Portions = 0,
    Allergens = [],
    OnOrder
}) => {
    const isAvailable = Portions > 0;

    return(
        <Card style={{...listingCardStyle}}>
            {ImageSource && (
                <Box style={imageContainerStyle}>
                    <CardMedia
                        component="img"
                        image={ImageSource}
                        alt={Title}
                        style={imageStyle}
                    />
                    <span style={{...portionsStyle, backgroundColor: `#${Constants.Gray}`}}>
                        {Portions} portions
                    </span>
                </Box>
            )}

            <CardContent style={listingContentStyle}>
                {!ImageSource && (
                    <span style={{...portionsStyle, position: "static", backgroundColor: `#${Constants.Gray}`}}>
                        {Portions} portions
                    </span>
                )}

                <h2 style={titleStyle}>{Title}</h2>
                <p style={notesStyle}>{Notes}</p>

                {Allergens.length > 0 && (
                    <div style={allergensStyle}>
                        {Allergens.map((Allergen) => (
                            <AllergenChip
                                key={Allergen.id}
                                Text={Allergen.name}
                                Size="medium"
                            />
                        ))}
                    </div>
                )}

                <div style={orderButtonStyle}>
                    <TextButton
                        Text="Order"
                        OnClick={OnOrder}
                        BorderRadius="8px"
                        Color={Constants.White}
                        BackColor={Constants.Gray}
                        IsRaised={false}
                        Disabled={!isAvailable}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ListingCard;
