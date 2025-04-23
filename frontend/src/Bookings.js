import React, { useState, useEffect } from 'react';

function Bookings() {
    const currentUserFullName = localStorage.getItem('fullName');
    const currentUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const [selectedFloor, setSelectedFloor] = useState('2');
    const [selectedTime, setSelectedTime] = useState('08:00');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingName, setBookingName] = useState('');
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 14);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const spinnerStyle = {
        border: '6px solid rgba(255,255,255,0.2)',
        borderTop: '6px solid #29abe2',
        borderRadius: '50%',
        width: 50,
        height: 50,
        animation: 'spin 1s linear infinite',
        margin: '60px auto'
    };

    const fetchRooms = async (floor, time, date) => {
        setSelectedRoom(null);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/rooms?floor=${floor}&time=${encodeURIComponent(time)}&date=${date}`
            );
            const data = await response.json();
            if (response.ok) setAvailableRooms(data.rooms || []);
            else setError(data.error || 'Error fetching rooms.');
        } catch {
            setError('Error fetching rooms.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRooms(selectedFloor, selectedTime, bookingDate);
    }, [selectedFloor, selectedTime, bookingDate]);

    const handleBookingSubmit = async e => {
        e.preventDefault();
        if (!selectedRoom) return;

        const effectiveName =
            currentUserFullName && currentUserFullName !== 'undefined'
                ? currentUserFullName
                : bookingName;

        const payload = {
            room: selectedRoom.room,
            floor: selectedFloor,
            bookingTime: selectedTime,
            bookingDate,
            userName: currentUser,
            fullName: effectiveName
        };

        setSubmitting(true);
        try {
            const resp = await fetch('http://127.0.0.1:5000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (resp.ok) {
                setBookingConfirmation(
                    `Booking Successful!\n\nName: ${effectiveName}\nDate: ${bookingDate}\nTime: ${selectedTime}\nRoom: ${selectedRoom.room}`
                );
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

    const controlStyle = {
        fontSize: 16,
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid #88b5ff',
        background: 'linear-gradient(135deg,#e9f3ff 0%,#cfe3ff 100%)',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };

    const sharkCardBase = {
        padding: 28,
        borderRadius: '14px 14px 40px 40px',
        background: 'linear-gradient(145deg,#0077be 0%,#003f5c 100%)',
        color: '#fff',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        transition: 'transform 0.12s, box-shadow 0.12s'
    };

    return (
        <div
            style={{
                backgroundImage:
                    'url("https://bpb-us-e1.wpmucdn.com/sites.nova.edu/dist/c/2/files/2016/01/DSC_00371.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)'
                }}
            ></div>

            <div
                style={{
                    padding: '30px',
                    maxWidth: 1100,
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <h1 style={{ marginBottom: 28, textAlign: 'center', fontSize: 36, color: '#fff' }}>
                    Study Room Bookings
                </h1>

                {/* Controls */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 20,
                        marginBottom: 40,
                        justifyContent: 'center'
                    }}
                >
                    <div>
                        <label style={{ fontWeight: 600, fontSize: 17, color: '#fff' }} htmlFor="floorSelect">
                            Floor
                        </label>
                        <select
                            id="floorSelect"
                            value={selectedFloor}
                            onChange={e => setSelectedFloor(e.target.value)}
                            style={{ ...controlStyle, marginLeft: 12 }}
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, fontSize: 17, color: '#fff' }} htmlFor="timeSelect">
                            Time
                        </label>
                        <select
                            id="timeSelect"
                            value={selectedTime}
                            onChange={e => setSelectedTime(e.target.value)}
                            style={{ ...controlStyle, marginLeft: 12 }}
                        >
                            {timeSlots.map(slot => (
                                <option key={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, fontSize: 17, color: '#fff' }} htmlFor="dateSelect">
                            Date
                        </label>
                        <input
                            id="dateSelect"
                            type="date"
                            value={bookingDate}
                            onChange={e => setBookingDate(e.target.value)}
                            min={minDate}
                            max={maxDate}
                            style={{ ...controlStyle, marginLeft: 12 }}
                        />
                    </div>
                </div>

                {/* Available Rooms */}
                <div>
                    <h2 style={{ textAlign: 'center', fontSize: 28, marginBottom: 15, color: '#fff' }}>
                        Available Rooms
                    </h2>

                    {loading ? (
                        <div style={spinnerStyle}></div>
                    ) : error ? (
                        <p style={{ color: 'red', textAlign: 'center', fontSize: 18 }}>{error}</p>
                    ) : availableRooms.length === 0 ? (
                        <p style={{ textAlign: 'center', fontSize: 18, color: '#fff' }}>
                            No available rooms on Floor {selectedFloor} at {selectedTime}.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
                                gap: 22,
                                marginTop: 20
                            }}
                        >
                            {availableRooms.map(room => {
                                const isSelected =
                                    selectedRoom && selectedRoom.room === room.room;
                                return (
                                    <div
                                        key={room.room}
                                        onClick={() => setSelectedRoom(room)}
                                        style={{
                                            ...sharkCardBase,
                                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                                            boxShadow: isSelected
                                                ? '0 6px 18px rgba(0,0,0,0.35)'
                                                : sharkCardBase.boxShadow
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={e => {
                                            if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                                            🦈 {room.room}
                                        </div>
                                        <div
                                            style={{
                                                marginTop: 8,
                                                fontWeight: 600,
                                                color: '#b3f5ff',
                                                fontSize: 17
                                            }}
                                        >
                                            Available
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Booking form */}
                {selectedRoom && (
                    <div
                        style={{
                            marginTop: 45,
                            padding: 26,
                            borderRadius: 12,
                            border: '2px solid #0077be',
                            background: '#ffffff',
                            maxWidth: 550,
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        <h2 style={{ textAlign: 'center', fontSize: 26, marginBottom: 6 }}>
                            Book {selectedRoom.room}
                        </h2>
                        <p style={{ textAlign: 'center', fontSize: 17, marginBottom: 22 }}>
                            Floor {selectedFloor} &nbsp;|&nbsp; {bookingDate} &nbsp;|&nbsp;{' '}
                            {selectedTime}
                        </p>

                        <form onSubmit={handleBookingSubmit}>
                            {currentUser ? (
                                <p style={{ textAlign: 'center', fontSize: 17, marginBottom: 18 }}>
                                    Booking as:&nbsp;
                                    <strong>
                                        {currentUserFullName && currentUserFullName !== 'undefined'
                                            ? currentUserFullName
                                            : currentUser}
                                    </strong>
                                </p>
                            ) : (
                                <div style={{ marginBottom: 20 }}>
                                    <label htmlFor="bookingName" style={{ fontSize: 16 }}>
                                        Your Name
                                    </label>
                                    <input
                                        id="bookingName"
                                        type="text"
                                        value={bookingName}
                                        onChange={e => setBookingName(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: 12,
                                            marginTop: 6,
                                            borderRadius: 6,
                                            border: '1px solid #ccc',
                                            fontSize: 16
                                        }}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    padding: 14,
                                    background:
                                        'linear-gradient(45deg,#29abe2 0%,#0077be 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontSize: 18,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                    transition: 'background 0.25s, transform 0.15s'
                                }}
                                onMouseEnter={e =>
                                    (e.currentTarget.style.background =
                                        'linear-gradient(45deg,#4cc8ff 0%,#1495e0 100%)')
                                }
                                onMouseLeave={e =>
                                    (e.currentTarget.style.background =
                                        'linear-gradient(45deg,#29abe2 0%,#0077be 100%)')
                                }
                                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {submitting ? 'Processing…' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                )}

                {bookingConfirmation && (
                    <div
                        style={{
                            marginTop: 28,
                            color: '#28a745',
                            whiteSpace: 'pre-line',
                            textAlign: 'center',
                            fontSize: 18,
                            fontWeight: 600
                        }}
                    >
                        {bookingConfirmation}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookings;
