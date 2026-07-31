/**
 * Represents a user in the database
 */
class UserRequestModel {

    constructor(universityId, firstName, lastName, email, username, password) {
        this.universityId = universityId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

module.exports = UserRequestModel;
