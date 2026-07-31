/**
 * Represents a rating in the database
 */
class RatingResponseModel {

    constructor(id, requestId, dateCreated, dateUpdated, rating) {
        this.id = id;
        this.requestId = requestId;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.rating = rating;
    }
}

module.exports = RatingResponseModel;