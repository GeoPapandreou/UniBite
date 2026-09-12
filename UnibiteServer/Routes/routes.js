class Routes {

  /**
   ** The home route
   ** /Unibite
   */
  static HomeRoute = "/Unibite";

  /**
   ** The users' route
   ** /Unibite/users
   */
  static UsersRoute = Routes.HomeRoute + "/users";

  /**
   ** The route to a user
   ** /Unibite/users/2
   */
  static UserRoute = Routes.UsersRoute + "/:id";

  /**
   ** The admins' route
   ** /Unibite/admins
   */
  static AdminsRoute = Routes.HomeRoute + "/admins";

  /**
   ** The route to an admin
   ** /Unibite/admins/2
   */
  static AdminRoute = Routes.AdminsRoute + "/:id";

  /**
   ** The universities' route
   ** /Unibite/universities
   */
  static UniversitiesRoute = Routes.HomeRoute + "/universities";

  /**
   ** The route to a university
   ** /Unibite/universities/2
   */
  static UniversityRoute = Routes.UniversitiesRoute + "/:id";

  /**
   ** The allergens' route
   ** /Unibite/allergens
   */
  static AllergensRoute = Routes.HomeRoute + "/allergens";

  /**
   ** The route to an allergen
   ** /Unibite/allergens/2
   */
  static AllergenRoute = Routes.AllergensRoute + "/:id";

  /**
   ** The listings' route
   ** /Unibite/listings
   */
  static ListingsRoute = Routes.HomeRoute + "/listings";

  /**
   ** The route to a listing
   ** /Unibite/listings/2
   */
  static ListingRoute = Routes.ListingsRoute + "/:id";

  /**
   ** The listing allergens' route
   ** /Unibite/listingAllergens
   */
  static ListingAllergensRoute = Routes.HomeRoute + "/listingAllergens";

  /**
   ** The route to a listing allergen
   ** /Unibite/listingAllergens/2
   */
  static ListingAllergenRoute = Routes.ListingAllergensRoute + "/:id";

  /**
   ** The portion requests' route
   ** /Unibite/requests
   */
  static RequestsRoute = Routes.HomeRoute + "/requests";

  /**
   ** The route to a portion request
   ** /Unibite/requests/2
   */
  static RequestRoute = Routes.RequestsRoute + "/:id";

  /**
   ** The route to record collection or a no show
   ** /Unibite/requests/2/delivery
   */
  static RequestDeliveryRoute = Routes.RequestRoute + "/delivery";

  /**
   ** The ratings' route
   ** /Unibite/ratings
   */
  static RatingsRoute = Routes.HomeRoute + "/ratings";

  /**
   ** The route to a rating
   ** /Unibite/ratings/2
   */
  static RatingRoute = Routes.RatingsRoute + "/:id";
}

module.exports = Routes;
