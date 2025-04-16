import React, { useState, useEffect } from 'react';

function Profile() {
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedFullName = localStorage.getItem('fullName');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedFullName && storedFullName !== "undefined") {
            setFullName(storedFullName);
        }
    }, []);

    useEffect(() => {
        const fetchUserBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:5000/user_bookings?userName=${username}`);
                const data = await response.json();
                if (response.ok) {
                    setUserBookings(data.bookings);
                } else {
                    setError(data.error || "Error fetching user bookings.");
                }
            } catch (err) {
                console.error("Error fetching user bookings:", err);
                setError("Error fetching user bookings.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserBookings()
        }
    }, [username]);

    const deleteBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/bookings/${bookingId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (response.ok && data.message) {
                    setUserBookings((prevBookings) =>
                        prevBookings.filter((booking) => booking._id !== bookingId)
                    );
                } else {
                    alert(data.error || "Error deleting the booking.");
                }
            } catch (err) {
                console.error("Error deleting booking:", err)
            }
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>{fullName ? `${fullName}'s Bookings` : "My Bookings"}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{color: 'red'}}>{error}</p>
            ) : userBookings.length === 0 ? (
                <p> No bookings found.</p>
            ) : (
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {userBookings.map((booking, index) => (
                        <li
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                marginBottom: '10px',
                                padding: '10px',
                                borderRadius: '4px'
                            }}
                        >
                            <div>
                                <p><strong>Name:</strong> {booking.fullName ? booking.fullName : booking.userName}</p>
                                <p><strong>Date:</strong> {booking.bookingDate}</p>
                                <p><strong>Time:</strong> {booking.bookingTime}</p>
                                <p><strong>Room:</strong> {booking.room}</p>
                                <p><strong>Floor:</strong> {booking.floor}</p>
                            </div>
                            <button
                                onClick={() => deleteBooking(booking._id)}
                                style={{
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Profile;