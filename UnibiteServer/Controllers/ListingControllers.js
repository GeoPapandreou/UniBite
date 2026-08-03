const GetQueryResultAsync = require('../Config/db');

const Listing = require('../API models/Listing');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Gets all the listings
 */
exports.GetAllListings = async (req, res, next) => {

    let query = Listing.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};

/**
 ** Creates a new listing
 */
exports.CreateNewListing = async (req, res, next) => {

    let listing = new Listing(req.body.cookId, req.body.title, req.body.notes,req.body.photo, req.body.portions, req.body.pickupLocation, req.body.latitude, req.body.longitude, req.body.pickupDateTime, req.body.isActive);

    // Gets the SQL query for creating the listing
    let query = listing.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};

/**
 ** Gets the listing with the specified id
 */
exports.GetListingById = async (req, res, next) => {

    let query = Listing.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the listing with the specified id
 */
exports.UpdateListingById = async (req, res, next) => {

    let query = Listing.UpdateById(req.params.id, req.body.title, req.body.notes, req.body.photo, req.body.portions, req.body.pickupLocation, req.body.latitude, req.body.longitude, req.body.pickupDateTime, req.body.isActive);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing with id ${req.params.id} was not found.`, 404));
    }

    let query2 = Listing.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the listing with the specified id
 */
exports.DeleteListingById = async (req, res, next) => {

    let query = Listing.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The listing with id ${req.params.id} was deleted successfully.` });
};
