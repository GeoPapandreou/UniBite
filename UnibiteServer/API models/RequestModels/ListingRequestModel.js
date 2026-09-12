/**
 * Represents a listing in the database
 */
class ListingRequestModel {

    constructor(cookId, title, notes, photo, portions, pickupLocation, latitude, longitude, isActive = true, pickupDateTime) {
        this.cookId = cookId;
        this.title = title;
        this.notes = notes;
        this.photo = photo;
        this.portions = portions;
        this.pickupLocation = pickupLocation;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isActive = isActive;
        this.pickupDateTime = pickupDateTime;
    }
}

module.exports = ListingRequestModel;
