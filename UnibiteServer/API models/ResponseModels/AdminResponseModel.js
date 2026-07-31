/**
 * Represents an admin in the database
 */
 class AdminResponseModel{

    constructor(id, username, password, dateCreated, dateUpdated) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
    }
}

module.exports = AdminResponseModel;