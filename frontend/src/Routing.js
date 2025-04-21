import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Landing from './Landing';
import Bookings from './Bookings';
import CreateAccount from './CreateAccount';
import Profile from './Profile';
import NavBar from './NavBar';

function RequireAuth() {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" replace />;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('fullName');
            return <Navigate to="/" replace />;
        }
    } catch (e) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

function Routing() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route element={<RequireAuth />}>
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default Routing;
