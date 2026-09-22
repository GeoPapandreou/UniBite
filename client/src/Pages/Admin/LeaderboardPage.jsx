import { useEffect, useState } from "react";

import Constants from "../../Shared/Constants";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

const leaderboardPageStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    padding: "24px",
    boxSizing: "border-box"
};

const leaderboardCardStyle = {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "24px",
    borderRadius: "12px",
    backgroundColor: `#${Constants.White}`,
    boxShadow: Constants.BoxShadow,
    boxSizing: "border-box"
};

const titleStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "32px",
    fontWeight: 600
};

const sectionTitleStyle = {
    margin: 0,
    color: `#${Constants.Green}`,
    fontFamily: Constants.FontFamily,
    fontSize: "24px",
    fontWeight: 600
};

const leaderboardTextStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "18px"
};

const mealStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "8px 0",
    borderBottom: `1px solid #${Constants.Gray}`
};

const LeaderboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [topDonor, setTopDonor] = useState(null);
    const [topMeals, setTopMeals] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        /**
         ** Gets the top donor and the highest-rated meals
         */
        const GetLeaderboard = async() => {
            try {
                // fetch GET loads the related records used to calculate the leaderboard.
                const users = await fetch("/api/Unibite/users").then(Response => Response.json());
                const listings = await fetch("/api/Unibite/listings").then(Response => Response.json());
                const requests = await fetch("/api/Unibite/requests").then(Response => Response.json());
                const ratings = await fetch("/api/Unibite/ratings").then(Response => Response.json());

                // Rank cooks by portions actually collected, not by their current credit balance.
                const donorPortions = {};

                requests
                    .filter((Request) => Boolean(Request.isDelivered))
                    .forEach((Request) => {
                        const listing = listings.find((Listing) => Listing.id === Request.listingId);

                        if(listing) {
                            donorPortions[listing.cookId] =
                                (donorPortions[listing.cookId] || 0) + Number(Request.portion);
                        }
                    });

                const topDonorId = Object.keys(donorPortions)
                    .sort((firstId, secondId) => donorPortions[secondId] - donorPortions[firstId])[0];

                if(topDonorId) {
                    const user = users.find((User) => User.id === Number(topDonorId));

                    if(user) {
                        setTopDonor({
                            name: `${user.firstName} ${user.lastName}`,
                            portions: donorPortions[topDonorId]
                        });
                    }
                }

                const mealRatings = {};

                ratings.forEach((Rating) => {
                    const request = requests.find((Request) => Request.id === Rating.requestId);
                    const listing = request
                        ? listings.find((Listing) => Listing.id === request.listingId)
                        : null;

                    if(listing) {
                        if(!mealRatings[listing.id]) {
                            mealRatings[listing.id] = {
                                title: listing.title,
                                total: 0,
                                count: 0
                            };
                        }

                        mealRatings[listing.id].total += Number(Rating.rating);
                        mealRatings[listing.id].count += 1;
                    }
                });

                // Average each listing's ratings, sort highest first and display the top five.
                const meals = Object.values(mealRatings)
                    .map((Meal) => ({
                        title: Meal.title,
                        rating: Meal.total / Meal.count
                    }))
                    .sort((firstMeal, secondMeal) => secondMeal.rating - firstMeal.rating)
                    .slice(0, 5);

                setTopMeals(meals);
            }
            catch(error) {
                setErrorMessage(error.message);
            }
            finally {
                setIsLoading(false);
            }
        };

        GetLeaderboard();
    }, []);

    return(
        <div className="leaderboardPage" style={leaderboardPageStyle}>
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                    <h1 style={titleStyle}>Leaderboard</h1>

                    <div style={leaderboardCardStyle}>
                        <h2 style={sectionTitleStyle}>Top Donor</h2>
                        {topDonor ? (
                            <p style={leaderboardTextStyle}>
                                {topDonor.name} - {topDonor.portions} portions
                            </p>
                        ) : (
                            <p style={leaderboardTextStyle}>No donor data available.</p>
                        )}
                    </div>

                    <div style={leaderboardCardStyle}>
                        <h2 style={sectionTitleStyle}>Highest-rated meals</h2>
                        {topMeals.length > 0 ? (
                            topMeals.map((Meal) => (
                                <div key={Meal.title} style={mealStyle}>
                                    <span style={leaderboardTextStyle}>{Meal.title}</span>
                                    <span style={leaderboardTextStyle}>
                                        {Meal.rating.toFixed(1)} / 5
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={leaderboardTextStyle}>No rating data available.</p>
                        )}
                    </div>
                </>
            )}

            <ErrorDialog
                Text={errorMessage}
                IsOpen={errorMessage !== ""}
                IsOpenHandler={() => setErrorMessage("")}
            />
        </div>
    );
};

export default LeaderboardPage;
