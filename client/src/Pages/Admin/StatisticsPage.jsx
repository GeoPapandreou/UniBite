import { useEffect, useState } from "react";

import Constants from "../../Shared/Constants";
import Loading from "../../Components/Animations/Loading";
import ErrorDialog from "../../Components/Dialogs/ErrorDialog";

const statisticsPageStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    padding: "24px",
    boxSizing: "border-box"
};

const statisticCardStyle = {
    width: "100%",
    maxWidth: "500px",
    padding: "32px",
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

const statisticNumberStyle = {
    margin: 0,
    color: `#${Constants.Green}`,
    fontFamily: Constants.FontFamily,
    fontSize: "48px",
    fontWeight: 600
};

const statisticTextStyle = {
    margin: 0,
    color: `#${Constants.Gray}`,
    fontFamily: Constants.FontFamily,
    fontSize: "20px"
};

const StatisticsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [totalPortions, setTotalPortions] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        /**
         ** Gets the number of portions shared successfully during the last month
         */
        const GetStatistics = async() => {
            try {
                const response = await fetch("/api/Unibite/requests");

                if(!response.ok) {
                    throw new Error("Could not get the statistics.");
                }

                const requests = await response.json();
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                const portions = requests
                    .filter((Request) => {
                        const requestDate = new Date(Request.dateCollected || Request.dateUpdated);
                        return Boolean(Request.isDelivered) && requestDate >= lastMonth;
                    })
                    .reduce((total, Request) => total + Number(Request.portion), 0);

                setTotalPortions(portions);
            }
            catch(error) {
                setErrorMessage(error.message);
            }
            finally {
                setIsLoading(false);
            }
        };

        GetStatistics();
    }, []);

    return(
        <div className="statisticsPage" style={statisticsPageStyle}>
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                    <h1 style={titleStyle}>Statistics</h1>

                    <div style={statisticCardStyle}>
                        <p style={statisticNumberStyle}>{totalPortions}</p>
                        <p style={statisticTextStyle}>
                            Portions shared successfully during the last month
                        </p>
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

export default StatisticsPage;
