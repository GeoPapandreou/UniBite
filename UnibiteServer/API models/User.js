const ControllerHelpers = require('../Helpers/ControllerHelpers');

/**
 * Represents the user from a request
 */
class User{

    /**
     ** Default constructor 
     * @param {string} username The username
     * @param {string} email The email
     * @param {string} password The password
     * @param {string} firstName The first name
     * @param {string} lastName The last name
     * @param {int} universityId The university id
     */
    constructor(universityId, firstName, lastName, email, username, password) {
        this.universityId = universityId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    /**
     ** Creates a user 
     */
    Create() {

        let dateTimeNow = ControllerHelpers.GetCurrentDateTime();

        let dateCreated = dateTimeNow;
        let dateUpdated = dateTimeNow;

        let query = `
            INSERT INTO users(universityId, firstName, lastName, email, username, password, dateCreated, dateUpdated)
            VALUES('${this.universityId}', '${this.firstName}', '${this.lastName}', '${this.email}', '${this.username}', '${this.password}', '${dateCreated}', '${dateUpdated}');
        `;

        return query;
    }

    /**
     ** Creates multiple users 
     * @param {string} valuesString The values
     */
    static BulkCreate(valuesString) {
        let query = `INSERT INTO users(universityId, firstName, lastName, email, username, password, dateCreated, dateUpdated) VALUES ${valuesString};`;

        return query;
    }

    /**
     ** Gets all the users 
     */
    static GetAll() {
        let query = `SELECT * FROM users`;

        return query;
    }

    /**
     ** Gets the user with the specified id 
     * @param {int} id The id
     */
    static GetById(id) {
        let query = `SELECT * FROM users WHERE id = ${id};`;

        return query;
    }

    /**
     ** Updates the username and the password
     * @param {int} id 
     * @param {string} newUsername 
     * @param {string} newPassword 
     * @returns the sql query
     */
    static UpdateById(id, newUsername, newPassword) {

        // Gets the current date time as string
        var dateUpdated = ControllerHelpers.GetCurrentDateTime();

        if(ControllerHelpers.IsNullOrEmpty(newUsername) && ControllerHelpers.IsNullOrEmpty(newPassword)) {   
            let query = `SELECT* FROM users  
            WHERE id = ${id};`;
            return query;
        } else if(ControllerHelpers.IsNullOrEmpty(newPassword)) {
            let query = `UPDATE users SET 
            username = "${newUsername}", 
            dateUpdated = "${dateUpdated}" 
            WHERE id = ${id};`;
            return query;
        } else if(ControllerHelpers.IsNullOrEmpty(newUsername))
        {
            let query = `UPDATE users SET 
            password = "${newPassword}", 
            dateUpdated = "${dateUpdated}" 
            WHERE id = ${id};`;
            return query;
        }
        else {
            let query = `UPDATE users SET 
            username = "${newUsername}", 
            password = "${newPassword}", 
            dateUpdated = "${dateUpdated}" 
            WHERE id = ${id};`;
            return query;
        };
        
    }

    /**
     ** Deletes the username and the password
     * @param {int} id 
     * @returns 
     * 
     */
     static DeleteById(id) {

         let query = `DELETE FROM users WHERE id = ${id};`;

        return query;
    }
}

module.exports = User;