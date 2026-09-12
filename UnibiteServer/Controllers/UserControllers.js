const GetQueryResultAsync = require('../Config/db');

const ControllerHelpers = require('../Helpers/ControllerHelpers');

const User = require('../API models/User');
const University = require('../API models/University');

// Imports the custom error response 
const ErrorResponse = require("../utils/errorResponse");

/**
 ** Gets all the users
 */
 exports.GetAllUsers = async (req, res, next) => {

    let query = User.GetAll();

    // Execute the query
    var result = await GetQueryResultAsync(query);

    // Set the body of the response
    res.status(200).json(result);
};

/**
 ** Creates a new user
 */
 exports.CreateNewUser =  async (req, res, next) => {
    let universityId = Number(req.body?.universityId);
    let { firstName, lastName, email, username, password } = req.body || {};

    if(!Number.isSafeInteger(universityId) || universityId <= 0) {
        return res.status(400).json({ message: "Please select a university." });
    }

    if([firstName, lastName, email, username, password].some(Value => typeof Value !== "string" || Value.trim() === "")) {
        return res.status(400).json({ message: "Please complete all the registration fields." });
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    username = username.trim();

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if(firstName.length > 80 || lastName.length > 80 || email.length > 255 || username.length > 45 || password.length > 45) {
        return res.status(400).json({ message: "Names can have up to 80 characters, email 255, and username/password 45." });
    }

    try {
        let universities = await GetQueryResultAsync(University.GetById(universityId));
        if(universities.length === 0) {
            return res.status(400).json({ message: "The selected university no longer exists." });
        }

        // Match the model's constructor. The database gives new users 5 credits.
        let user = new User(universityId, firstName, lastName, email, username, password);
        var result = await GetQueryResultAsync(user.Create());

        res.status(201).json(result);
    }
    catch(error) {
        if(error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "This username or email is already in use." });
        }

        return res.status(500).json({ message: "Could not create your account. Please try again." });
    }
};

/**
 ** Gets a user with id the specified id
 */
 exports.GetUserById = async (req, res, next) => {

    let query = User.GetById(req.params.id);

    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The user with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(result[0]);
};

/**
 ** Updates the user with the given id
 */
 exports.UpdateUserById = async (req, res, next) => {
    
    let query = User.UpdateById(req.params.id, req.body.username, req.body.password);
    
    var result = await GetQueryResultAsync(query);

    let query2 = User.GetById(req.params.id);

    var result2 = await GetQueryResultAsync(query2);

    if(result2.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The username with id ${req.params.id} was not found.`, 404));
    }

    res.status(201).json(result2);
};

/**
 ** Deletes the user with the given id 
 */
 exports.DeleteUserById = async (req, res, next) => {
    
    let query = User.DeleteById(req.params.id);
    var result = await GetQueryResultAsync(query);

    if(result.length == 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The username with id ${req.params.id} was not found.`, 404));
    }

    res.status(200).json(User);
};
