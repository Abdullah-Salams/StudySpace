import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';
import Landing from './Landing';
import Bookings from './Bookings';
import CreateAccount from './CreateAccount';
import Profile from './Profile';
import NavBar from './NavBar';

// Conditionally render NavBar except on landing & registration pages
function AppRoutes() {
    const location = useLocation();
    const hideNav =
        location.pathname === '/' || location.pathname === '/create-account';
    const currentUser = localStorage.getItem('username');

    return (
        <>
            {!hideNav && <NavBar currentUser={currentUser} />}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route
                    path="/profile"
                    element={<Profile currentUser={currentUser} />}
                />
            </Routes>
        </>
    );
}

function Routing() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default Routing;
