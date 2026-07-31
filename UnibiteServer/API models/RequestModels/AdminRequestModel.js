/**
 * Represents an admin in the database
 */
class AdminRequestModel {

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

module.exports = AdminRequestModel;
