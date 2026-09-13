const GetQueryResultAsync = require('../Config/db');
const { ExecuteTransactionAsync } = require('../Config/db');

const Listing = require('../API models/Listing');
const ListingAllergen = require('../API models/ListingAllergen');
const Allergen = require('../API models/Allergen');
const Request = require('../API models/Request');
const ControllerHelpers = require('../Helpers/ControllerHelpers');

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

    // The optional photo is sent as a data URL and stored in the existing BLOB.
    if(req.body.photo != null && (typeof req.body.photo !== "string" || Buffer.byteLength(req.body.photo) > 65535)) {
        return res.status(400).json({ message: "The photo is too large. Please choose a smaller image." });
    }

    let pickupDateTime = new Date(req.body.pickupDateTime);
    if(typeof req.body.pickupDateTime !== "string" || !Number.isFinite(pickupDateTime.getTime()) || pickupDateTime <= new Date()) {
        return res.status(400).json({ message: "Please choose a valid pickup date and time in the future." });
    }

    let listing = new Listing(req.body.cookId, req.body.title, req.body.notes,req.body.photo, req.body.portions, req.body.pickupLocation, req.body.latitude, req.body.longitude, req.body.isActive, ControllerHelpers.FormatDateTime(pickupDateTime));

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
    let id = Number(req.params.id);
    let cookId = Number(req.body?.cookId);
    let { title, notes, portions, pickupLocation, latitude, longitude, photo, allergenIds, originalPortions, originalDateUpdated } = req.body || {};
    let pickupDateTime = new Date(req.body?.pickupDateTime);

    if(!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(cookId) || cookId <= 0) {
        return res.status(400).json({ message: "A valid listing and cook are required." });
    }

    if(typeof title !== "string" || title.trim() === "" || title.trim().length > 120 ||
        typeof notes !== "string" || Buffer.byteLength(notes) > 65535 ||
        typeof pickupLocation !== "string" || pickupLocation.trim() === "" || pickupLocation.trim().length > 255) {
        return res.status(400).json({ message: "Please enter valid listing details." });
    }

    if(!Number.isSafeInteger(portions) || portions < 0 || !Number.isFinite(latitude) || Math.abs(latitude) > 90 ||
        !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
        return res.status(400).json({ message: "Please enter non-negative whole portions and a valid map location." });
    }

    if(typeof req.body.pickupDateTime !== "string" || !Number.isFinite(pickupDateTime.getTime())) {
        return res.status(400).json({ message: "A valid pickup date and time are required." });
    }

    if(!Array.isArray(allergenIds) || allergenIds.some(Id => !Number.isSafeInteger(Id) || Id <= 0)) {
        return res.status(400).json({ message: "Please select valid allergens." });
    }

    if(photo != null && (typeof photo !== "string" || Buffer.byteLength(photo) > 65535)) {
        return res.status(400).json({ message: "The photo is too large. Please choose a smaller image." });
    }

    if(!Number.isFinite(originalPortions) || typeof originalDateUpdated !== "string" || !Number.isFinite(new Date(originalDateUpdated).getTime())) {
        return res.status(400).json({ message: "Please reopen the listing before editing it." });
    }

    try {
        var result = await ExecuteTransactionAsync(async (Query) => {
            let listings = await Query(Listing.GetByIdForUpdate(id));
            if(listings.length === 0) throw new ErrorResponse("This listing no longer exists.", 404);

            let listing = listings[0];
            if(Number(listing.cookId) !== cookId) {
                throw new ErrorResponse("You can only edit your own listings.", 403);
            }

            // Do not overwrite portions that were reduced by an accepted request.
            if(Number(listing.portions) !== originalPortions || new Date(listing.dateUpdated).getTime() !== new Date(originalDateUpdated).getTime()) {
                throw new ErrorResponse("This listing has changed. Please reopen My Listings before editing it again.", 409);
            }

            let pickupTimeChanged = pickupDateTime.getTime() !== new Date(listing.pickupDateTime).getTime();
            let pickupChanged = pickupTimeChanged || pickupLocation.trim() !== listing.pickupLocation ||
                latitude !== Number(listing.latitude) || longitude !== Number(listing.longitude);

            if(pickupChanged) {
                let requests = await Query(Request.GetOutstandingByListingId(id));
                if(requests.length > 0) {
                    throw new ErrorResponse("Pickup details cannot change while requests are pending or awaiting collection.", 409);
                }
            }

            if(pickupTimeChanged && pickupDateTime <= new Date()) {
                throw new ErrorResponse("Please choose a new pickup date and time in the future.", 400);
            }

            let availableAllergens = await Query(Allergen.GetAll());
            if(allergenIds.some(Id => !availableAllergens.some(Allergen => Allergen.id === Id))) {
                throw new ErrorResponse("One of the selected allergens no longer exists.", 400);
            }

            // Keep the stored photo unless a replacement is supplied. Creation time stays unchanged.
            await Query(Listing.UpdateById(id, title.trim(), notes.trim(), photo === undefined ? listing.photo : photo,
                portions, pickupLocation.trim(), latitude, longitude, listing.isActive, ControllerHelpers.FormatDateTime(pickupDateTime)));

            await Query(ListingAllergen.DeleteByListingId(id));
            for(const allergenId of new Set(allergenIds)) {
                await Query(new ListingAllergen(id, allergenId).Create());
            }

            let updatedListings = await Query(Listing.GetById(id));
            return updatedListings[0];
        });

        res.status(200).json(result);
    }
    catch(error) {
        if(error.statusCode) return res.status(error.statusCode).json({ message: error.message });
        return res.status(500).json({ message: "Could not update the listing. No changes were saved. Please try again." });
    }
};

/**
 ** Deletes the listing with the specified id
 */
exports.DeleteListingById = async (req, res, next) => {
    let id = Number(req.params.id);
    let cookId = Number(req.body?.cookId);

    if(!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(cookId) || cookId <= 0) {
        return res.status(400).json({ message: "A valid listing and cook are required." });
    }

    try {
        await ExecuteTransactionAsync(async (Query) => {
            let listings = await Query(Listing.GetByIdForUpdate(id));
            if(listings.length === 0) throw new ErrorResponse("This listing no longer exists.", 404);

            if(Number(listings[0].cookId) !== cookId) {
                throw new ErrorResponse("You can only delete your own listings.", 403);
            }

            // Lock requests so cancellation or collection cannot change their credits mid-delete.
            let requests = await Query(Request.GetByListingIdForUpdate(id));
            for(const request of requests) {
                if(request.isApproved === null || (Number(request.isApproved) === 1 && request.isDelivered === null)) {
                    let refund = await Query(Request.RefundUncollectedCreditsById(request.id));
                    if(refund.affectedRows === 0) {
                        throw new ErrorResponse("The reserved credits could not be refunded. The listing was not deleted.", 409);
                    }
                }
            }

            // Existing foreign keys also delete the requests, ratings and allergen links.
            let result = await Query(Listing.DeleteById(id));
            if(result.affectedRows === 0) throw new ErrorResponse("This listing no longer exists.", 404);
        });

        res.status(200).json({ message: "Listing deleted and reserved credits refunded." });
    }
    catch(error) {
        if(error.statusCode) return res.status(error.statusCode).json({ message: error.message });
        return res.status(500).json({ message: "Could not delete the listing. No changes were saved. Please try again." });
    }
};
