/**
 * The response to an error
 * @param {string} message 
 * @param {number} statusCode 
 */
class ErrorResponse extends Error {
    /**
     * Creates a new instance of an @see {ErrorResponse}
     * @param {string} message 
     * @param {number} statusCode 
     */
    constructor(message, statusCode) 
    {
        // Adds the message
        super(message);
        // Sets as status code the given status code
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;