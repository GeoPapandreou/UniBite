const GetQueryResultAsync = require('../Config/db');
const { ExecuteTransactionAsync } = require('../Config/db');
const Request = require('../API models/Request');

let isChecking = false;
let checkTimer = null;

/**
 ** Applies one penalty per collected request that missed its rating deadline
 */
const ApplyRatingPenalties = async () => {
    if(isChecking) return;
    isChecking = true;

    try {
        let requests = await GetQueryResultAsync(Request.GetOverdueRatings());

        for(const request of requests) {
            try {
                await ExecuteTransactionAsync(async (Query) => {
                    // Rating submissions use the same lock, so the two actions cannot race.
                    await Query(Request.GetByIdForUpdate(request.id));

                    // Recheck the deadline, rating and flag while saving the deduction.
                    await Query(Request.ApplyRatingPenaltyById(request.id));
                });
            }
            catch(error) {
                console.error(`Could not apply the rating penalty for request ${request.id}:`, error.code || error.message);
            }
        }
    }
    catch(error) {
        console.error("Could not check overdue ratings:", error.code || error.message);
    }
    finally {
        isChecking = false;
    }
};

/**
 ** Checks on startup and every minute; unfinished checks are never overlapped
 */
const StartRatingPenaltyChecks = () => {
    if(checkTimer) return;

    ApplyRatingPenalties();
    checkTimer = setInterval(ApplyRatingPenalties, 60 * 1000);
    checkTimer.unref();
};

module.exports = { ApplyRatingPenalties, StartRatingPenaltyChecks };
