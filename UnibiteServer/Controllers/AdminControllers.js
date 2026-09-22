const GetQueryResultAsync = require('../Config/db');

const ControllerHelpers = require('../Helpers/ControllerHelpers');

const Admin = require('../API models/Admin');

// Imports the custom error response 
const ErrorResponse = require("../utils/errorResponse");

/**
 * Gets all the admins
 */
 exports.GetAllAdmins = async (req, res, next) => {

    // LoginPage fetches /admins.
    var query = `SELECT * FROM admins`;

    // Execute the query
    var results = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(results);
};

/**
 * Creates a new admin
 */
 exports.CreateNewAdmin =  async (req, res, next) => {
    let admin = new Admin(req.body.username, req.body.password);
    
    // Gets the sql query for creating the admin
    let query = admin.Create();
    
    // Execute the query
    var result = await GetQueryResultAsync(query);
    
    res.status(201).json(result);
};

/**
 * Gets an admin by id
 */
 exports.GetAdminById = (async (req, res, next) => {

    let query = Admin.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The admin with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
});

/**
 * Update an admin by id
 */
 exports.UpdateAdminById = (async (req, res, next) => {
    
    let query = Admin.UpdateById(req.params.id, req.body.username, req.body.password);
    var result = await GetQueryResultAsync(query);
    
    res.status(201).json(result2);
});

/**
 * Deletes an admin by id
 */
 exports.DeleteAdminById = (async (req, res, next) => {
    
    let query = Admin.DeleteById(req.params.id);
    var result = await GetQueryResultAsync(query);

    res.status(200).json(Admin);
});