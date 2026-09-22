const ControllerHelpers = require('../Helpers/ControllerHelpers');

/**
 * Represents the rating from a request
 */
class Rating{

    /**
     ** Default constructor
     * @param {int} requestId The portion request id
     * @param {double} rating The rating value
     */
    constructor(requestId, rating) {
        this.requestId = requestId;
        this.rating = rating;
    }

    /**
     ** Creates a rating
     */
    Create() {
        // The 48-hour rating window starts at actual collection, not the scheduled pickup time.
        // Check it using database time at the moment the rating is saved.
        let query = `
            INSERT INTO ratings(requestId, dateCreated, dateUpdated, rating)
            SELECT id, NOW(), NOW(), ${this.rating} FROM requests
            WHERE id = ${this.requestId}
                AND isApproved = 1
                AND isDelivered = 1
                AND dateCollected <= NOW()
                AND dateCollected > DATE_SUB(NOW(), INTERVAL 48 HOUR);
        `;

        return query;
    }

    /**
     ** Creates multiple ratings
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO ratings(requestId, dateCreated, dateUpdated, rating) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the ratings
     */
    static GetAll() {
        let query = `SELECT * FROM ratings`;

        return query;
    }

    /**
     ** Gets the rating with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM ratings WHERE id = ${id};`;

        return query;
    }

    /**
     ** Gets all the ratings for the specified request
     * @param {int} requestId The portion request id
     */
    static GetByRequestId(requestId) {
        let query = `SELECT * FROM ratings WHERE requestId = ${requestId};`;

        return query;
    }

    /**
     ** Gives the cook one bonus credit inside the new rating's transaction
     * @param {int} requestId The collected request id
     */
    static AwardCookBonusByRequestId(requestId) {
        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        let query = `UPDATE users AS cook
            INNER JOIN listings AS listing ON listing.cookId = cook.id
            INNER JOIN requests AS portionRequest ON portionRequest.listingId = listing.id
            SET cook.credits = cook.credits + 1,
                cook.dateUpdated = '${dateUpdated}'
            WHERE portionRequest.id = ${requestId};`;

        return query;
    }

    /**
     ** Updates the rating
     * @param {int} id The id
     * @param {double} newRating The new rating value
     * @returns The SQL query
     */
    static UpdateById(id, newRating) {

        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        let query = `UPDATE ratings SET
            rating = ${newRating},
            dateUpdated = "${dateUpdated}"
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the rating
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM ratings WHERE id = ${id};`;

        return query;
    }
}

module.exports = Rating;
