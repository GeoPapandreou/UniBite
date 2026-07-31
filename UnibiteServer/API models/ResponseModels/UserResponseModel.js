/**
 * Represents a user in the database
 */
 class UserResponseModel{

    constructor(id, universityId, firstName, lastName, username, email, password, credits, dateCreated, dateUpdated) {
        this.id = id;
        this.universityId = universityId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.credits = credits;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
    }
}

module.exports = UserResponseModel;