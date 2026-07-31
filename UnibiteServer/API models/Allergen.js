/**
 * Represents an allergen
 */
class Allergen {

    /**
     ** Default constructor
     * @param {string} name The allergen name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     ** Creates an allergen
     */
    Create() {

        let query = `
            INSERT INTO allergens(name)
            VALUES('${this.name}');
        `;

        return query;
    }

    /**
     ** Creates multiple allergens
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO allergens(name) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the allergens
     */
    static GetAll() {
        let query = `SELECT * FROM allergens`;

        return query;
    }

    /**
     ** Gets the allergen with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM allergens WHERE id = ${id};`;

        return query;
    }

    /**
     ** Updates the allergen name
     * @param {int} id The id
     * @param {string} newName The new allergen name
     * @returns The SQL query
     */
    static UpdateById(id, newName) {

        let query = `UPDATE allergens SET
            name = "${newName}"
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the allergen
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM allergens WHERE id = ${id};`;

        return query;
    }
}

module.exports = Allergen;