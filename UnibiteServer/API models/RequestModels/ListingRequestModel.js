/**
 * Represents a listing in the database
 */
class ListingRequestModel {

    constructor(cookId, title, notes, photo, portions, pickupLocation, pickupDateTime, isActive = true) {
        this.cookId = cookId;
        this.title = title;
        this.notes = notes;
        this.photo = photo;
        this.portions = portions;
        this.pickupLocation = pickupLocation;
        this.pickupDateTime = pickupDateTime;
        this.isActive = isActive;
    }
}

module.exports = ListingRequestModel;
