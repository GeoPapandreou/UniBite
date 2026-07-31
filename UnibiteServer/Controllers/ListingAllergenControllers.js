const GetQueryResultAsync = require('../Config/db');

const ListingAllergen = require('../API models/ListingAllergen');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Creates a new listing and allergen relationship
 */
exports.CreateNewListingAllergen = async (req, res, next) => {

    let listingAllergen = new ListingAllergen(req.body.listingId, req.body.allergensId);

    // Gets the SQL query for creating the relationship
    let query = listingAllergen.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};


/**
 ** Gets all the listing and allergen relationships
 */
exports.GetAllListingAllergens = async (req, res, next) => {

    let query = ListingAllergen.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};


/**
 ** Gets the listing and allergen relationship with the specified id
 */
exports.GetListingAllergenById = async (req, res, next) => {

    let query = ListingAllergen.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing allergen relationship with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the listing and allergen relationship with the specified id
 */
exports.UpdateListingAllergenById = async (req, res, next) => {

    let query = ListingAllergen.UpdateById(req.params.id, req.body.listingId, req.body.allergensId);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing allergen relationship with id ${req.params.id} was not found.`, 404));
    }

    let query2 = ListingAllergen.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the listing and allergen relationship with the specified id
 */
exports.DeleteListingAllergenById = async (req, res, next) => {

    let query = ListingAllergen.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The listing allergen relationship with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The listing allergen relationship with id ${req.params.id} was deleted successfully.` });
};
