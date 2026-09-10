/**
 * Represents a portion request in the database
 */
class RequestResponseModel {


    constructor(id, listingId, consumerId, dateCreated, dateUpdated, pickupDateTime, dateCollected, isApproved, isDelivered, portion) {
        this.id = id;
        this.listingId = listingId;
        this.consumerId = consumerId;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.pickupDateTime = pickupDateTime;
        this.dateCollected = dateCollected;
        this.isApproved = isApproved;
        this.isDelivered = isDelivered;
        this.portion = portion;
    }
}

module.exports = RequestResponseModel;
