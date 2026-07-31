/**
 * Represents a university in the database
 */
class UniversityRequestModel {

    constructor(name, city, address) {
        this.name = name;
        this.city = city;
        this.address = address;
    }
}

module.exports = UniversityRequestModel;
