const ControllerHelpers = require('../Helpers/ControllerHelpers');

/**
 * Represents the portion request from a user
 */
class Request{

    /**
     ** Default constructor
     * @param {int} listingId The listing id
     * @param {int} consumerId The consumer id
     * @param {string} pickupDateTime The proposed pickup date and time
     * @param {double} portion The requested portion
     */
    constructor(listingId, consumerId, pickupDateTime, portion=1) {
        this.listingId = listingId;
        this.consumerId = consumerId;
        this.pickupDateTime = pickupDateTime;
        this.portion = portion;
    }

    /**
     ** Creates a portion request
     */
    Create() {

        let dateTimeNow = ControllerHelpers.GetCurrentDateTime();

        let dateCreated = dateTimeNow;
        let dateUpdated = dateTimeNow;

        let query = `
            INSERT INTO requests(listingId, consumerId, dateCreated, dateUpdated, pickupDateTime, dateCollected, isApproved, isDelivered, portion)
            VALUES(${this.listingId}, ${this.consumerId}, '${dateCreated}', '${dateUpdated}', '${this.pickupDateTime}', NULL, NULL, NULL, ${this.portion});
        `;

        return query;
    }

    /**
     ** Creates multiple portion requests
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO requests(listingId, consumerId, dateCreated, dateUpdated, pickupDateTime, dateCollected, isApproved, isDelivered, portion) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the portion requests
     */
    static GetAll() {
        let query = `SELECT * FROM requests`;

        return query;
    }

    /**
     ** Gets the portion request with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM requests WHERE id = ${id};`;

        return query;
    }

    /**
     ** Gets all the portion requests for the specified listing
     * @param {int} listingId The listing id
     */
    static GetByListingId(listingId) {
        let query = `SELECT * FROM requests WHERE listingId = ${listingId};`;

        return query;
    }

    /**
     ** Gets all the portion requests for the specified consumer
     * @param {int} consumerId The consumer id
     */
    static GetByConsumerId(consumerId) {
        let query = `SELECT * FROM requests WHERE consumerId = ${consumerId};`;

        return query;
    }

    /**
     ** Updates the portion request
     * @param {int} id The id
     * @param {boolean} newIsApproved TRUE if the request is approved
     * @param {boolean} newIsDelivered TRUE if the portion is delivered
     * @param {Date|string} newDateCollected The collection date and time
     * @param {double} newPortion The requested portion
     * @param {string} newPickupDateTime The proposed pickup date and time, unchanged if omitted
     * @returns The SQL query
     */
    static UpdateById(id, newIsApproved, newIsDelivered, newDateCollected, newPortion, newPickupDateTime) {

        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        let isApproved = newIsApproved === null || newIsApproved === undefined
            ? "NULL"
            : newIsApproved ? 1 : 0;

        let isDelivered = newIsDelivered === null || newIsDelivered === undefined
            ? "NULL"
            : newIsDelivered ? 1 : 0;

        let dateCollected = newDateCollected === null || newDateCollected === undefined || newDateCollected === ""
            ? "NULL"
            : `'${newDateCollected}'`;

        // Keep the existing pickup time when it is not included in the update
        let pickupDateTime = newPickupDateTime === undefined
            ? "pickupDateTime"
            : `'${newPickupDateTime}'`;

        let query = `UPDATE requests SET
            isApproved = ${isApproved},
            isDelivered = ${isDelivered},
            pickupDateTime = ${pickupDateTime},
            dateCollected = ${dateCollected},
            portion = ${newPortion},
            dateUpdated = "${dateUpdated}"
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Accepts or declines a pending request for the specified cook
     * @param {int} id The request id
     * @param {int} cookId The listing owner id
     * @param {boolean} isApproved True = accept, False = decline
     */
    static UpdateApprovalById(id, cookId, isApproved) {
        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        // Accepting updates the request and remaining portions
        let portionUpdate = isApproved
            ? `listing.portions = listing.portions - portionRequest.portion,
               listing.dateUpdated = '${dateUpdated}',`
            : "";

        let availabilityCheck = isApproved
            ? `AND listing.isActive = 1
               AND listing.dateCreated > DATE_SUB(NOW(), INTERVAL 48 HOUR)
               AND portionRequest.portion > 0
               AND listing.portions >= portionRequest.portion`
            : "";

        let query = `UPDATE requests AS portionRequest
            INNER JOIN listings AS listing ON listing.id = portionRequest.listingId
            SET ${portionUpdate}
                portionRequest.isApproved = ${isApproved ? 1 : 0},
                portionRequest.dateUpdated = '${dateUpdated}'
            WHERE portionRequest.id = ${id}
                AND listing.cookId = ${cookId}
                AND portionRequest.isApproved IS NULL
                ${availabilityCheck};`;

        return query;
    }

    /**
     ** Deletes a pending request belonging to the specified consumer
     * @param {int} id The request id
     * @param {int} consumerId The requester id
     */
    static CancelById(id, consumerId) {
        let query = `DELETE FROM requests
            WHERE id = ${id}
                AND consumerId = ${consumerId}
                AND isApproved IS NULL;`;

        return query;
    }

    /**
     ** Deletes the portion request
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM requests WHERE id = ${id};`;

        return query;
    }
}

module.exports = Request;
