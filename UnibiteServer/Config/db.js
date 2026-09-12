// Get the MySQL driver module
var mysqlModule = require("mysql2");


// Create the MySQL connection
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: "1122",
    database: "unibitedb",
};

const MySQLConnection = mysqlModule.createConnection(connectionOptions);

/**
 * Executes and returns the result of @param mySQLQuery asynchronously
 * @param {MySQL query} mySQLQuery
 */
const GetQueryResultAsync = async (mySQLQuery) => {
    // Return the query's execution result, wrapped in a promise object
    return new Promise((data, reject) => {
        // Execute the query
        MySQLConnection.query(mySQLQuery, function (error, result) {
            // If there was an error...
            if (error) {
                // Reject the request without stopping the server.
                return reject(error);
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

/**
 * Runs related queries on their own connection, saving all changes or none.
 */
const ExecuteTransactionAsync = async (ExecuteQueries) => {
    const connection = mysqlModule.createConnection(connectionOptions).promise();

    try {
        await connection.beginTransaction();

        const Query = async (query) => {
            const [result] = await connection.query(query);
            return result;
        };

        const result = await ExecuteQueries(Query);
        await connection.commit();
        return result;
    }
    catch(error) {
        await connection.rollback();
        throw error;
    }
    finally {
        await connection.end();
    }
};

module.exports = GetQueryResultAsync;
module.exports.ExecuteTransactionAsync = ExecuteTransactionAsync;
