const express = require('express');

const userControllers = require('../Controllers/UserControllers');
const adminControllers = require('../Controllers/AdminControllers');
const universityControllers = require('../Controllers/UniversityControllers');
const allergenControllers = require('../Controllers/AllergenControllers');
const listingControllers = require('../Controllers/ListingControllers');
const listingAllergenControllers = require('../Controllers/ListingAllergenControllers');
const requestControllers = require('../Controllers/RequestControllers');
const ratingControllers = require('../Controllers/RatingControllers');

const router = express.Router();

const Routes = require('./routes');

/**
 * @route GET and POST route -> /users/
 */
router
  .route(Routes.UsersRoute)
  .get(userControllers.GetAllUsers)
  .post(userControllers.CreateNewUser);

/**
 * @route GET, PUT and DELETE route -> /users/:id
 */
router
  .route(Routes.UserRoute)
  .get(userControllers.GetUserById)
  .put(userControllers.UpdateUserById)
  .delete(userControllers.DeleteUserById);

/**
 * @route GET and POST route -> /admins/
 */
router
  .route(Routes.AdminsRoute)
  .get(adminControllers.GetAllAdmins)
  .post(adminControllers.CreateNewAdmin);

/**
 * @route GET, PUT and DELETE route -> /admins/:id
 */
router
  .route(Routes.AdminRoute)
  .get(adminControllers.GetAdminById)
  .put(adminControllers.UpdateAdminById)
  .delete(adminControllers.DeleteAdminById);

/**
 * @route GET and POST route -> /universities/
 */
router
  .route(Routes.UniversitiesRoute)
  .get(universityControllers.GetAllUniversities)
  .post(universityControllers.CreateNewUniversity);

/**
 * @route GET, PUT and DELETE route -> /universities/:id
 */
router
  .route(Routes.UniversityRoute)
  .get(universityControllers.GetUniversityById)
  .put(universityControllers.UpdateUniversityById)
  .delete(universityControllers.DeleteUniversityById);

/**
 * @route GET and POST route -> /allergens/
 */
router
  .route(Routes.AllergensRoute)
  .get(allergenControllers.GetAllAllergens)
  .post(allergenControllers.CreateNewAllergen);

/**
 * @route GET, PUT and DELETE route -> /allergens/:id
 */
router
  .route(Routes.AllergenRoute)
  .get(allergenControllers.GetAllergenById)
  .put(allergenControllers.UpdateAllergenById)
  .delete(allergenControllers.DeleteAllergenById);

/**
 * @route GET and POST route -> /listings/
 */
router
  .route(Routes.ListingsRoute)
  .get(listingControllers.GetAllListings)
  .post(listingControllers.CreateNewListing);

/**
 * @route GET, PUT and DELETE route -> /listings/:id
 */
router
  .route(Routes.ListingRoute)
  .get(listingControllers.GetListingById)
  .put(listingControllers.UpdateListingById)
  .delete(listingControllers.DeleteListingById);

/**
 * @route GET and POST route -> /listingAllergens/
 */
router
  .route(Routes.ListingAllergensRoute)
  .get(listingAllergenControllers.GetAllListingAllergens)
  .post(listingAllergenControllers.CreateNewListingAllergen);

/**
 * @route GET, PUT and DELETE route -> /listingAllergens/:id
 */
router
  .route(Routes.ListingAllergenRoute)
  .get(listingAllergenControllers.GetListingAllergenById)
  .put(listingAllergenControllers.UpdateListingAllergenById)
  .delete(listingAllergenControllers.DeleteListingAllergenById);

/**
 * @route GET and POST route -> /requests/
 */
router
  .route(Routes.RequestsRoute)
  .get(requestControllers.GetAllRequests)
  .post(requestControllers.CreateNewRequest);

/**
 * @route GET, PUT, PATCH and DELETE route -> /requests/:id
 */
router
  .route(Routes.RequestRoute)
  .get(requestControllers.GetRequestById)
  .put(requestControllers.UpdateRequestById)
  .patch(requestControllers.UpdateRequestApproval)
  .delete(requestControllers.DeleteRequestById);

/**
 * @route GET and POST route -> /ratings/
 */
router
  .route(Routes.RatingsRoute)
  .get(ratingControllers.GetAllRatings)
  .post(ratingControllers.CreateNewRating);

/**
 * @route GET, PUT and DELETE route -> /ratings/:id
 */
router
  .route(Routes.RatingRoute)
  .get(ratingControllers.GetRatingById)
  .put(ratingControllers.UpdateRatingById)
  .delete(ratingControllers.DeleteRatingById);

module.exports = router;
