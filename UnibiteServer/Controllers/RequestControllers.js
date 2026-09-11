const GetQueryResultAsync = require('../Config/db');

const Request = require('../API models/Request');
const Listing = require('../API models/Listing');
const ControllerHelpers = require('../Helpers/ControllerHelpers');

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

    let listingId = Number(req.body.listingId);
    let consumerId = Number(req.body.consumerId);
    let portion = Number(req.body.portion);

    if(!Number.isSafeInteger(listingId) || listingId <= 0 || !Number.isSafeInteger(consumerId) || consumerId <= 0) {
        return res.status(400).json({ message: "A valid listing and user are required." });
    }

    if(!Number.isSafeInteger(portion) || portion <= 0) {
        return res.status(400).json({ message: "Please choose a positive whole number of portions." });
    }

    // Keep the date format sent by the existing frontend date helper.
    let pickupDateTime = new Date(req.body.pickupDateTime);
    if(typeof req.body.pickupDateTime !== "string" || !Number.isFinite(pickupDateTime.getTime()) || pickupDateTime <= new Date()) {
        return res.status(400).json({ message: "Please choose a valid pickup date and time in the future." });
    }

    // Check the current listing before creating a pending request.
    let listings = await GetQueryResultAsync(Listing.GetById(listingId));
    if(listings.length === 0) {
        return res.status(404).json({ message: "This listing no longer exists." });
    }

    let listing = listings[0];
    if(Number(listing.cookId) === consumerId) {
        return res.status(400).json({ message: "You cannot order your own listing." });
    }

    let dateCreated = new Date(listing.dateCreated);
    if(!listing.isActive || !Number.isFinite(dateCreated.getTime()) || Date.now() - dateCreated.getTime() >= 48 * 60 * 60 * 1000) {
        return res.status(400).json({ message: "This listing is no longer available." });
    }

    if(portion > Number(listing.portions)) {
        return res.status(400).json({ message: "There are not enough portions available." });
    }

    let portionRequest = new Request(listingId, consumerId, ControllerHelpers.FormatDateTime(pickupDateTime), portion);

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

    let query = Request.UpdateById(req.params.id, req.body.isApproved, req.body.isDelivered, req.body.dateCollected, req.body.portion, req.body.pickupDateTime);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return next(new ErrorResponse(`ERROR 404: Not found. The request with id ${req.params.id} was not found.`, 404));
    }

    let query2 = Request.GetById(req.params.id);
    var result2 = await GetQueryResultAsync(query2);

    res.status(200).json(result2[0]);
};

/**
 ** Accepts or declines a pending request for the listing owner
 */
exports.UpdateRequestApproval = async (req, res, next) => {
    let id = Number(req.params.id);
    let cookId = Number(req.body.cookId);
    let isApproved = req.body.isApproved;

    if(!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(cookId) || cookId <= 0 || typeof isApproved !== "boolean") {
        return res.status(400).json({ message: "A valid request, cook and approval decision are required." });
    }

    let requests = await GetQueryResultAsync(Request.GetById(id));
    if(requests.length === 0) {
        return res.status(404).json({ message: "This request no longer exists." });
    }

    let listings = await GetQueryResultAsync(Listing.GetById(requests[0].listingId));
    if(listings.length === 0) {
        return res.status(404).json({ message: "This listing no longer exists." });
    }

    if(Number(listings[0].cookId) !== cookId) {
        return res.status(403).json({ message: "Only the listing owner can accept or decline this request." });
    }

    if(requests[0].isApproved !== null) {
        return res.status(409).json({ message: "This request has already been accepted or declined." });
    }

    // The update checks ownership, pending status and portions again when saving.
    let query = Request.UpdateApprovalById(id, cookId, isApproved);
    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return res.status(409).json({ message: "The request has changed, or the listing is no longer available with enough portions. Please refresh the page." });
    }

    res.status(200).json({ message: isApproved ? "Request accepted." : "Request declined." });
};

/**
 ** Cancels a pending request for its requester
 */
exports.DeleteRequestById = async (req, res, next) => {

    let id = Number(req.params.id);
    let consumerId = Number(req.body?.consumerId);

    if(!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(consumerId) || consumerId <= 0) {
        return res.status(400).json({ message: "A valid request and user are required." });
    }

    let requests = await GetQueryResultAsync(Request.GetById(id));
    if(requests.length === 0) {
        return res.status(404).json({ message: "This request no longer exists." });
    }

    if(Number(requests[0].consumerId) !== consumerId) {
        return res.status(403).json({ message: "You can only cancel your own request." });
    }

    if(requests[0].isApproved !== null) {
        return res.status(409).json({ message: "Only pending requests can be cancelled." });
    }

    // Recheck ownership and pending status when deleting. Portions stay unchanged.
    let query = Request.CancelById(id, consumerId);

    var result = await GetQueryResultAsync(query);

    if(result.affectedRows === 0) {
        return res.status(409).json({ message: "The request has changed or was already cancelled. Please refresh the page." });
    }

    res.status(200).json({ message: "Request cancelled." });
};
