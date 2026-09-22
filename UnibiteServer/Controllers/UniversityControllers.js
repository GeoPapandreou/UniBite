const GetQueryResultAsync = require('../Config/db');

const University = require('../API models/University');

// Imports the custom error response
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Gets all the universities
 */
exports.GetAllUniversities = async (req, res, next) => {

    // From RegisterPage's GET /universities 
    let query = University.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};

/**
 ** Creates a new university
 */
exports.CreateNewUniversity = async (req, res, next) => {

    let university = new University(req.body.name, req.body.city, req.body.address);

    // Gets the SQL query for creating the university
    let query = university.Create();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    res.status(201).json(result);
};

/**
 ** Gets the university with the specified id
 */
exports.GetUniversityById = async (req, res, next) => {

    let query = University.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The university with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the university with the specified id
 */
exports.UpdateUniversityById = async (req, res, next) => {

    let query = University.UpdateById(req.params.id, req.body.name, req.body.city, req.body.address);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The university with id ${req.params.id} was not found.`, 404));
    }

    let query2 = University.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Deletes the university with the specified id
 */
exports.DeleteUniversityById = async (req, res, next) => {

    let query = University.DeleteById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The university with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json({ message: `The university with id ${req.params.id} was deleted successfully.` });
};
