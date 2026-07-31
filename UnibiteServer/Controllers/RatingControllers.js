const GetQueryResultAsync = require('../Config/db');

const Rating = require('../API models/Rating');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Gets all the ratings
 */
exports.GetAllRatings = async (req, res, next) => {

    let query = Rating.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};

/**
 ** Creates a new rating
 */
exports.CreateNewRating = async (req, res, next) => {

    let rating = new Rating(req.body.requestId, req.body.rating);

    // Gets the SQL query for creating the rating
    let query = rating.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};

/**
 ** Gets the rating with the specified id
 */
exports.GetRatingById = async (req, res, next) => {

    let query = Rating.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The rating with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the rating with the specified id
 */
exports.UpdateRatingById = async (req, res, next) => {

    let query = Rating.UpdateById(req.params.id, req.body.rating);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The rating with id ${req.params.id} was not found.`, 404));
    }

    let query2 = Rating.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the rating with the specified id
 */
exports.DeleteRatingById = async (req, res, next) => {

    let query = Rating.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The rating with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The rating with id ${req.params.id} was deleted successfully.` });
};
