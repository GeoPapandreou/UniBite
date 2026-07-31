const ControllerHelpers = require('../Helpers/ControllerHelpers');
/**
* Represents the admin in the database
*/

class Admin{

    /**
     ** Default constructor
     * @param {string} username The username
     * @param {string} password The password
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     ** Creates an insert user query from the model
     */
    Create() {

        let query = `INSERT INTO admins(username, password) VALUES("${this.username}", "${this.password}");`;

        return query;
    }

    /**
     ** Gets all the admins query
     */
    static GetAll() {
        let query = 'SELECT * FROM admins';

        return query;
    }

    /**
     ** Gets the admin with the given id
     * @param {int} id 
     */
    static GetById(id) {
        let query = `SELECT * FROM admins WHERE id = ${id};`;

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
        let query = `UPDATE admins SET username = "${newUsername}", 
                                    password = "${newPassword}"
                    WHERE id = ${id};`;

        return query;
    }

    /**
     ** Deletes the admin
     * @param {int} id 
     * @returns 
     * 
     */
     static DeleteById(id) {

        let query = `DELETE FROM admins WHERE id = ${id};`;

       return query;
   }
}

module.exports = Admin;