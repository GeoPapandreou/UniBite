// Get the MySQL driver module
var mysqlModule = require("mysql2");


// Create the MySQL connection
const MySQLConnection = mysqlModule.createConnection({
    host: "localhost",
    user: "root",
    password: "1122",
    database: "unibitedb",
});

/**
 * Executes and returns the result of @param mySQLQuery asynchronously
 * @param {MySQL query} mySQLQuery
 */
const GetQueryResultAsync = async (mySQLQuery) => {
    // Return the query's execution result, wrapped in a promise object
    return new Promise((data) => {
        // Execute the query
        MySQLConnection.query(mySQLQuery, function (error, result) {
            // If there was an error...
            if (error) {
                // Throw the error
                throw error;
            }

            // Try to return the results
            try {
                // Return an array that contains the results
                data(result);
            } catch (error) {
                // Return empty array
                data({});
                // Trow the error
                throw error;
            }
        });
    });
};

module.exports = GetQueryResultAsync;