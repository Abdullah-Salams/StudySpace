import React, { useState, useEffect } from 'react';

function Profile() {
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedFullName = localStorage.getItem('fullName');
        if (storedUsername) setUsername(storedUsername);
        if (storedFullName && storedFullName !== 'undefined') setFullName(storedFullName);
    }, []);

    useEffect(() => {
        const fetchUserBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/user_bookings?userName=${username}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await response.json();
                response.ok ? setUserBookings(data.bookings) : setError(data.error || 'Error fetching user bookings.');
            } catch {
                setError('Error fetching user bookings.');
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchUserBookings();
    }, [username, token]);

    const deleteBooking = async id => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.message) setUserBookings(prev => prev.filter(b => b._id !== id));
            else alert(data.error || 'Error deleting the booking.');
        } catch {
            /* ignore */
        }
    };

    const pageStyle = {
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
    };

    const buttonBase = {
        background: 'linear-gradient(45deg,#ff6b6b 0%,#ff4d4d 100%)',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background 0.25s, transform 0.15s'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ marginBottom: '25px', textAlign: 'center' }}>
                    {fullName ? `${fullName}'s Bookings` : 'My Bookings'}
                </h1>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                ) : userBookings.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No bookings found.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {userBookings.map(booking => (
                            <li
                                key={booking._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px 20px',
                                    marginBottom: '15px',
                                    background: '#f7f9fc'
                                }}
                            >
                                <div>
                                    <p style={{ margin: 0 }}>
                                        <strong>Name:</strong> {booking.fullName || booking.userName}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        <strong>Date:</strong> {booking.bookingDate}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        <strong>Time:</strong> {booking.bookingTime}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        <strong>Room:</strong> {booking.room}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        <strong>Floor:</strong> {booking.floor}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteBooking(booking._id)}
                                    style={buttonBase}
                                    onMouseEnter={e =>
                                        (e.currentTarget.style.background =
                                            'linear-gradient(45deg,#ff8e8e 0%,#ff6b6b 100%)')
                                    }
                                    onMouseLeave={e =>
                                        (e.currentTarget.style.background =
                                            'linear-gradient(45deg,#ff6b6b 0%,#ff4d4d 100%)')
                                    }
                                    onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                                    onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Profile;
