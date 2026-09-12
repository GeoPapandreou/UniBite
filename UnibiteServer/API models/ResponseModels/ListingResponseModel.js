/**
 * Represents a listing in the database
 */
class ListingResponseModel {

    constructor(id, cookId, dateCreated, dateUpdated, title, notes, photo, portions, pickupLocation, isActive, pickupDateTime) {
        this.id = id;
        this.cookId = cookId;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.title = title;
        this.notes = notes;
        this.photo = photo;
        this.portions = portions;
        this.pickupLocation = pickupLocation;
        this.isActive = isActive;
        this.pickupDateTime = pickupDateTime;
    }
}

module.exports = ListingResponseModel;
