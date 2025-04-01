import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Bookings from './Bookings';

function Routing() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/bookings" element={<Bookings />} />
        </Routes>
    </Router>
    );
}

export default Routing