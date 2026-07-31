const ControllerHelpers = require('../Helpers/ControllerHelpers');

/**
 * Represents the university from a request
 */
class University{

    /**
     ** Default constructor
     * @param {string} name The university name
     * @param {string} city The university city
     * @param {string} address The university address
     */
    constructor(name, city, address) {
        this.name = name;
        this.city = city;
        this.address = address;
    }

    /**
     ** Creates a university
     */
    Create() {

        let dateTimeNow = ControllerHelpers.GetCurrentDateTime();

        let dateCreated = dateTimeNow;
        let dateUpdated = dateTimeNow;

        let query = `
            INSERT INTO university(name, city, address, dateCreated, dateUpdated)
            VALUES('${this.name}', '${this.city}', '${this.address}', '${dateCreated}', '${dateUpdated}');
        `;

        return query;
    }

    /**
     ** Creates multiple universities
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO university(name, city, address, dateCreated, dateUpdated) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the universities
     */
    static GetAll() {
        let query = `SELECT * FROM university`;

        return query;
    }

    /**
     ** Gets the university with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM university WHERE id = ${id};`;

        return query;
    }

    /**
     ** Updates the university name, city and address
     * @param {int} id The id
     * @param {string} newName The new university name
     * @param {string} newCity The new university city
     * @param {string} newAddress The new university address
     * @returns The SQL query
     */
    static UpdateById(id, newName, newCity, newAddress) {

        let dateUpdated = ControllerHelpers.GetCurrentDateTime();

        let query = `UPDATE university SET
            name = "${newName}",
            city = "${newCity}",
            address = "${newAddress}",
            dateUpdated = "${dateUpdated}"
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the university
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM university WHERE id = ${id};`;

        return query;
    }
}

module.exports = University;
