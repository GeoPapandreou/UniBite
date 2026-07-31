/**
 * Represents a portion request in the database
 */
class ReqRequestModel {

    constructor(listingId, consumerId, portion, isApproved, isDelivered) {
        this.listingId = listingId;
        this.consumerId = consumerId;
        this.portion = portion;
        this.isApproved = isApproved;
        this.isDelivered = isDelivered;
    }
}

module.exports = ReqRequestModel;
