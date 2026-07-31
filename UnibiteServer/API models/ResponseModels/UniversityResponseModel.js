/**
 * Represents a university in the database
 */
class UniversityResponseModel{


    constructor(id,name, city, address, dateCreated, dateUpdated) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.address = address;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
    }
}

module.exports = UniversityResponseModel;