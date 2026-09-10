import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProfilePage from "./Pages/User/ProfilePage";
import LoginPage from "./Pages/LoginRegisterForms/LoginPage";
import RegisterPage from "./Pages/LoginRegisterForms/RegisterPage";
import HomePage from "./Pages/User/HomePage";
import RequestsPage from "./Pages/User/RequestsPage";
import StatisticsPage from "./Pages/Admin/StatisticsPage";
import LeaderboardPage from "./Pages/Admin/LeaderboardPage";
import LayoutPage from "./Pages/LayoutPage";

const App = () => {
    return(
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="sign-up" element={<RegisterPage/>}/>

                    <Route path="admins/:adminId" element={<LayoutPage/>}>
                        <Route path="statistics" element={<StatisticsPage/>}/>
                        <Route path="leaderboard" element={<LeaderboardPage/>}/>
                    </Route>

                    <Route path="users/:userId" element={<LayoutPage/>}>
                        <Route path="home" element={<HomePage/>}/>
                        <Route path="requests" element={<RequestsPage/>}/>
                        <Route path="profile" element={<ProfilePage/>}/>
                    </Route>
                </Routes>
            </Router>
        </>
    );
};

export default App;
