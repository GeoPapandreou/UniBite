const GetQueryResultAsync = require('../Config/db');

const Request = require('../API models/Request');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Gets all the portion requests
 */
exports.GetAllRequests = async (req, res, next) => {

    let query = Request.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};

/**
 ** Creates a new portion request
 */
exports.CreateNewRequest = async (req, res, next) => {

    let portionRequest = new Request(req.body.listingId, req.body.consumerId, req.body.portion);

    // Gets the SQL query for creating the portion request
    let query = portionRequest.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};

/**
 ** Gets the portion request with the specified id
 */
exports.GetRequestById = async (req, res, next) => {

    let query = Request.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The request with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the portion request with the specified id
 */
exports.UpdateRequestById = async (req, res, next) => {

    let query = Request.UpdateById(req.params.id, req.body.isApproved, req.body.isDelivered, req.body.dateCollected, req.body.portion);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The request with id ${req.params.id} was not found.`, 404));
    }

    let query2 = Request.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the portion request with the specified id
 */
exports.DeleteRequestById = async (req, res, next) => {

    let query = Request.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The request with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The request with id ${req.params.id} was deleted successfully.` });
};
