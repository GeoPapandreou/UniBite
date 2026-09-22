const GetQueryResultAsync = require('../Config/db');

const Allergen = require('../API models/Allergen');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Creates a new allergen
 */
exports.CreateNewAllergen = async (req, res, next) => {

    let allergen = new Allergen(req.body.name);

    // Gets the SQL query for creating the allergen
    let query = allergen.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};

/**
 ** Gets all the allergens
 */
exports.GetAllAllergens = async (req, res, next) => {

    // Gets all the allergens
    let query = Allergen.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};


/**
 ** Gets the allergen with the specified id
 */
exports.GetAllergenById = async (req, res, next) => {

    let query = Allergen.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The allergen with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the allergen with the specified id
 */
exports.UpdateAllergenById = async (req, res, next) => {

    let query = Allergen.UpdateById(req.params.id, req.body.name);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The allergen with id ${req.params.id} was not found.`, 404));
    }

    let query2 = Allergen.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the allergen with the specified id
 */
exports.DeleteAllergenById = async (req, res, next) => {

    let query = Allergen.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The allergen with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The allergen with id ${req.params.id} was deleted successfully.` });
};
