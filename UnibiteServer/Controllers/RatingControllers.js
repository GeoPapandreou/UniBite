const GetQueryResultAsync = require('../Config/db');
const { ExecuteTransactionAsync } = require('../Config/db');

const Rating = require('../API models/Rating');
const Request = require('../API models/Request');

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

    let requestId = Number(req.body?.requestId);
    let consumerId = Number(req.body?.consumerId);
    let ratingValue = req.body?.rating;

    if(!Number.isSafeInteger(requestId) || requestId <= 0 || !Number.isSafeInteger(consumerId) || consumerId <= 0) {
        return res.status(400).json({ message: "A valid request and user are required." });
    }

    if(!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: "Please select a rating from 1 to 5 stars." });
    }

    try {
        var result = await ExecuteTransactionAsync(async (Query) => {
            // Lock the request so simultaneous submissions cannot create two ratings.
            let requests = await Query(Request.GetByIdForUpdate(requestId));
            if(requests.length === 0) {
                throw new ErrorResponse("This request no longer exists.", 404);
            }

            if(Number(requests[0].consumerId) !== consumerId) {
                throw new ErrorResponse("You can only rate your own request.", 403);
            }

            if(Number(requests[0].isApproved) !== 1 || Number(requests[0].isDelivered) !== 1) {
                throw new ErrorResponse("You can only rate a collected order.", 409);
            }

            let ratings = await Query(Rating.GetByRequestId(requestId));
            if(ratings.length > 0) {
                throw new ErrorResponse("You have already rated this order.", 409);
            }

            let rating = new Rating(requestId, ratingValue);
            let ratingResult = await Query(rating.Create());
            if(ratingResult.affectedRows === 0) {
                throw new ErrorResponse("The 48-hour rating window has ended.", 409);
            }

            // A rating of 4 or 5 awards one bonus credit, regardless of the number of portions.
            // Save the rating and bonus in the same transaction so both succeed or both roll back.
            if(ratingValue > 3) {
                let bonusResult = await Query(Rating.AwardCookBonusByRequestId(requestId));
                if(bonusResult.affectedRows === 0) {
                    throw new ErrorResponse("Could not save the cook's rating bonus. Please try again.", 500);
                }
            }

            return ratingResult;
        });

        res.status(201).json(result);
    }
    catch(error) {
        if(error.statusCode) return res.status(error.statusCode).json({ message: error.message });
        return next(error);
    }
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
    // Ratings are submitted once and cannot be changed afterwards.
    res.status(405).json({ message: "Submitted ratings cannot be edited." });
};

/**
 ** Deletes the rating with the specified id
 */
exports.DeleteRatingById = async (req, res, next) => {
    // Deleting a rating would let the same request be rated again.
    res.status(405).json({ message: "Submitted ratings cannot be deleted individually." });
};
