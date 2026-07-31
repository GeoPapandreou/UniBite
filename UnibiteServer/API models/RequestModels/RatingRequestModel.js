/**
 * Represents a rating in the database
 */
class RatingRequestModel {

    constructor(requestId, rating) {
        this.requestId = requestId;
        this.rating = rating;
    }
}

module.exports = RatingRequestModel;
