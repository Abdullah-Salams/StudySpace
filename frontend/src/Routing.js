import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Bookings from './Bookings';
import CreateAccount from './CreateAccount';
import Profile from './Profile';
import NavBar from './NavBar';

function Routing() {
    const currentUser = localStorage.getItem('username');

    return (
    <Router>
        <NavBar currentUser={currentUser} />
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
        </Routes>
    </Router>
    );
}

export default Routing