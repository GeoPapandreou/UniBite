/**
 * Represents the relationship between a listing and an allergen
 */
class ListingAllergen{

    /**
     ** Default constructor
     * @param {int} id The relationship id
     * @param {int} listingId The listing id
     * @param {int} allergensId The allergen id
     */
    constructor(listingId, allergensId) {
        this.listingId = listingId;
        this.allergensId = allergensId;
    }

    /**
     ** Creates a listing and allergen relationship
     */
    Create() {
        let query = `
            INSERT INTO listingallergens(listingId, allergensId) VALUES(${this.listingId}, ${this.allergensId});
        `;

    return query;
    }

    /**
     ** Creates multiple listing and allergen relationships
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO listingallergens(listingId, allergensId) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the listing and allergen relationships
     */
    static GetAll() {
        let query = `SELECT * FROM listingallergens`;

        return query;
    }

    /**
     ** Gets the listing and allergen relationship with the specified id
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM listingallergens WHERE id = ${id};`;

        return query;
    }

    /**
     ** Gets all the allergens for the specified listing
     * @param {int} listingId The listing id
     */
    static GetByListingId(listingId) {
        let query = `SELECT * FROM listingallergens WHERE listingId = ${listingId};`;

        return query;
    }

    /**
     ** Updates the listing and allergen relationship
     * @param {int} id The id
     * @param {int} newListingId The new listing id
     * @param {int} newAllergensId The new allergen id
     * @returns The SQL query
     */
    static UpdateById(id, newListingId, newAllergensId) {

        let allergenId = newAllergensId === null || newAllergensId === undefined
            ? "NULL"
            : newAllergensId;

        let query = `UPDATE listingallergens SET
            listingId = ${newListingId},
            allergensId = ${allergenId}
            WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the listing and allergen relationship
     * @param {int} id The id
     * @returns The SQL query
     */
    static DeleteById(id) {

        let query = `DELETE FROM listingallergens WHERE id = ${id};`;

        return query;
    }
}

module.exports = ListingAllergen;
