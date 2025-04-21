import React, { useState, useEffect } from 'react';

function Bookings() {
    const currentUserFullName = localStorage.getItem('fullName');
    const currentUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [selectedTime, setSelectedTime] = useState('08:00');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingName, setBookingName] = useState('');
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 14);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    const fetchRooms = async (floor, time, date) => {
        setSelectedRoom(null);
        if (floor === '1') {
            setAvailableRooms([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:5000/rooms?floor=${floor}&time=${encodeURIComponent(time)}&date=${date}`);
            const data = await response.json();
            if (response.ok) {
                setAvailableRooms(data.rooms || []);
            } else {
                setError(data.error || 'Error fetching rooms.');
            }
        } catch {
            setError('Error fetching rooms.');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedFloor === '1') {
            setAvailableRooms([]);
        } else {
            fetchRooms(selectedFloor, selectedTime, bookingDate);
        }
    }, [selectedFloor, selectedTime, bookingDate]);

    const handleBookingSubmit = async e => {
        e.preventDefault();
        if (!selectedRoom) return;
        const effectiveUserName = currentUserFullName && currentUserFullName !== 'undefined' ? currentUserFullName : bookingName;
        const bookingData = { room: selectedRoom.room, floor: selectedFloor, bookingTime: selectedTime, bookingDate: bookingDate, userName: currentUser, fullName: effectiveUserName };
        setSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(bookingData) });
            const data = await response.json();
            if (response.ok) {
                setBookingConfirmation(`Booking Successful!\n\nName: ${effectiveUserName}\nDate: ${bookingDate}\nTime: ${selectedTime}\nRoom: ${selectedRoom.room}`);
                setSelectedRoom(null);
                if (!currentUser) setBookingName('');
                fetchRooms(selectedFloor, selectedTime, bookingDate);
            } else {
                setError(data.error || 'Error processing booking.');
            }
        } catch {
            setError('Error processing booking.');
        }
        setSubmitting(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Study Room Bookings</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px', justifyContent: 'center' }}>
                <div>
                    <label htmlFor="floorSelect">Floor</label>
                    <select id="floorSelect" value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)} style={{ marginLeft: '10px' }}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="timeSelect">Time</label>
                    <select id="timeSelect" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ marginLeft: '10px' }}>
                        {timeSlots.map(slot => (
                            <option key={slot}>{slot}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="dateSelect">Date</label>
                    <input id="dateSelect" type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={minDate} max={maxDate} style={{ marginLeft: '10px' }} />
                </div>
            </div>
            <div>
                <h2 style={{ textAlign: 'center' }}>Available Rooms</h2>
                {selectedFloor === '1' ? (
                    <p style={{ textAlign: 'center' }}>No study rooms available on Floor 1.</p>
                ) : loading ? (
                    <p style={{ textAlign: 'center' }}>Loading Rooms...</p>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                ) : availableRooms.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No available rooms on Floor {selectedFloor} at {selectedTime}.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '15px', marginTop: '15px' }}>
                        {availableRooms.map((room, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedRoom(room)}
                                style={{
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: selectedRoom && selectedRoom.room === room.room ? '3px solid #007bff' : '1px solid #ccc',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'transform 0.1s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{ fontSize: '22px', fontWeight: '600' }}>{room.room}</div>
                                <div style={{ marginTop: '8px', color: '#28a745', fontWeight: '500' }}>Available</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedRoom && (
                <div style={{ marginTop: '35px', padding: '20px', borderRadius: '8px', border: '1px solid #aaa', backgroundColor: '#fff', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <h2 style={{ textAlign: 'center' }}>Book {selectedRoom.room}</h2>
                    <p style={{ textAlign: 'center' }}>Floor {selectedFloor} | {bookingDate} | {selectedTime}</p>
                    <form onSubmit={handleBookingSubmit} style={{ marginTop: '20px' }}>
                        {currentUser ? (
                            <p style={{ textAlign: 'center' }}>Booking as: <strong>{currentUserFullName && currentUserFullName !== 'undefined' ? currentUserFullName : currentUser}</strong></p>
                        ) : (
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="bookingName">Your Name</label>
                                <input id="bookingName" type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                            </div>
                        )}
                        <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
                            {submitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            )}
            {bookingConfirmation && <div style={{ marginTop: '20px', color: 'green', whiteSpace: 'pre-line', textAlign: 'center' }}>{bookingConfirmation}</div>}
        </div>
    );
}

export default Bookings;
