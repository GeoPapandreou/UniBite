const ControllerHelpers = require('../Helpers/ControllerHelpers');

/**
 * Represents the listing from a request
 */
class Listing{

    /**
     ** Default constructor
     * @param {int} cookId The cook id
     * @param {string} title The listing title
     * @param {string} notes The listing notes
     * @param {Blob} photo The listing photo
     * @param {double} portions The available portions
     * @param {string} pickupLocation The pickup location
     * @param {number} latitude The pickup latitude
     * @param {number} longitude The pickup longitude
     * @param {boolean} isActive TRUE if the listing is active
     * @param {string} pickupDateTime The required pickup date and time
     */
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

    /**
     ** Creates a listing
     */
    Create() {

        let dateTimeNow = ControllerHelpers.GetCurrentDateTime();

        let dateCreated = dateTimeNow;
        let dateUpdated = dateTimeNow;

        // Notes are nullable in the database
        let notes = this.notes === null || this.notes === undefined || this.notes === ""
            ? "NULL"
            : `'${this.notes}'`;

        // Photo is nullable and can be represented as a Buffer
        let photo = "NULL";
        if(Buffer.isBuffer(this.photo))
            photo = `X'${this.photo.toString("hex")}'`;
        else if(this.photo !== null && this.photo !== undefined && this.photo !== "")
            photo = `'${this.photo}'`;

        let isActive = this.isActive ? 1 : 0;

        let query = `
            INSERT INTO listings(cookId, dateCreated, dateUpdated, title, notes, photo, portions, pickupLocation, latitude, longitude, isActive, pickupDateTime)
            VALUES(${this.cookId}, '${dateCreated}', '${dateUpdated}', '${this.title}', ${notes}, ${photo}, ${this.portions}, '${this.pickupLocation}', ${this.latitude}, ${this.longitude}, ${isActive}, '${this.pickupDateTime}');
        `;

        return query;
    }

    /**
     ** Creates multiple listings
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO listings(cookId, dateCreated, dateUpdated, title, notes, photo, portions, pickupLocation, latitude, longitude, isActive, pickupDateTime) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the listings
     */
    static GetAll() {
        let query = `SELECT * FROM listings`;

        return query;
    }

    /**
     ** Gets the listing with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM listings WHERE id = ${id};`;

        return query;
    }

    /**
     ** Updates the listing
     * @param {int} id The id
     * @param {string} newTitle The new title
     * @param {string} newNotes The new notes
     * @param {Blob} newPhoto The new photo
     * @param {double} newPortions The new available portions
     * @param {string} newPickupLocation The new pickup location
     * @param {number} newLatitude The new pickup latitude
     * @param {number} newLongitude The new pickup longitude
     * @param {boolean} newIsActive TRUE if the listing is active
     * @param {string} newPickupDateTime The new pickup date and time
     * @returns The SQL query
     */
    static UpdateById(id, newTitle, newNotes, newPhoto, newPortions, newPickupLocation, newLatitude, newLongitude, newIsActive, newPickupDateTime) {

        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        // Notes are nullable in the database
        let notes = newNotes === null || newNotes === undefined || newNotes === ""
            ? "NULL"
            : `'${newNotes}'`;

        // Photo is nullable and can be represented as a Buffer
        let photo = "NULL";
        if(Buffer.isBuffer(newPhoto))
            photo = `X'${newPhoto.toString("hex")}'`;
        else if(newPhoto !== null && newPhoto !== undefined && newPhoto !== "")
            photo = `'${newPhoto}'`;

        let isActive = newIsActive ? 1 : 0;

        let query = `UPDATE listings SET
            title = "${newTitle}",
            notes = ${notes},
            photo = ${photo},
            portions = ${newPortions},
            pickupLocation = "${newPickupLocation}",
            latitude = ${newLatitude},
            longitude = ${newLongitude},
            isActive = ${isActive},
            pickupDateTime = '${newPickupDateTime}',
            dateUpdated = "${dateUpdated}"
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the listing
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM listings WHERE id = ${id};`;

        return query;
    }
}

module.exports = Listing;
