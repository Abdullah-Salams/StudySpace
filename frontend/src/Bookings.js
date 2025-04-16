import React, { useState, useEffect } from 'react'

function Bookings() {
    const currentUserFullName = localStorage.getItem('fullName');
    const currentUser = localStorage.getItem('username');
    console.log("current User:", currentUser);
    const [selectedFloor, setSelectedFloor] = useState("1");
    const [selectedTime, setSelectedTime] = useState("8:00");
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingName, setBookingName] = useState("");
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
        "15:30", "16:00", "16:30", "17:00"];

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 14);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    const fetchRooms = async (floor, time, date) => {
        setSelectedRoom(null);
        if (floor === "1") {
            setAvailableRooms([]);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch( `http://127.0.0.1:5000/rooms?floor=${floor}&time=${encodeURIComponent(time)}&date=${date}`
            );
            const data = await response.json();
            if (response.ok) {
                setAvailableRooms(data.rooms || []);
            } else {
                setError(data.error || "Error fetching rooms.");
            }
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Error fetching rooms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedFloor === "1") {
            setAvailableRooms([]);
        } else {
            fetchRooms(selectedFloor, selectedTime, bookingDate);
        }
    }, [selectedFloor, selectedTime, bookingDate]);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoom)
            return;
        const effectiveUserName = (currentUserFullName && currentUserFullName !== "undefined") ? currentUserFullName: bookingName;

        const bookingData = {
            room: selectedRoom.room,
            floor: selectedFloor,
            bookingTime: selectedTime,
            bookingDate: bookingDate,
            userName: currentUser,
            fullName: effectiveUserName
        };

        console.log("booking Data:", bookingData);
        setSubmitting(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/bookings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (response.ok) {
                setBookingConfirmation(
                    'Booking Successful! The booking has been saved. \n\nBooking Details:\n' +
                    `Name: ${effectiveUserName}\n` +
                    `Date: ${bookingDate}\n` +
                    `Time: ${selectedTime}\n` +
                    `Room: ${selectedRoom.room}`
                );
                setSelectedRoom(null);
                if(!currentUser) {
                    setBookingName("");
                }
                fetchRooms(selectedFloor, selectedTime, bookingDate);
            } else {
                setError(data.error || "Error processing booking.");
            }
        } catch (err) {
            console.error("Booking error:", err);
            setError("Error processing booking.l");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{padding: "20px"}}>
            <h1>Study Room Bookings</h1>

            <div style={{marginBottom: "20px"}}>
                <label htmlFor="floorselect" style={{marginRight: "10px"}}>
                    Select Floor:
                </label>
                <select
                    id="floorSelect"
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    style={{marginRight: "20px"}}
                >
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                </select>
                <label htmlFor="timeSelect" style={{marginRight: "10px"}}>
                    Select Time:
                </label>
                <select
                    id="timeSelect"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={{ marginRight: "20px" }}
                >
                    {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>

                <label htmlFor="dateSelect" style={{ marginRight: "10px" }}>
                    Select Date:
                </label>
                <input
                    type="date"
                    id="dateSelect"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                />
            </div>

            <div>
                <h2>Available Rooms</h2>
                {selectedFloor === "1" ? (
                    <p>No study rooms available on Floor 1.</p>
                ) : loading ? (
                    <p>Loading Rooms...</p>
                ) : error ? (
                    <p style={{color: "red"}}>{error}</p>
                ) : availableRooms.length === 0 ? (
                    <p>
                        No available rooms on Floor {selectedFloor} at {selectedTime}.
                    </p>
                ) : (
                    <ul style={{listStyleType: "none", padding: 0}}>
                        {availableRooms.map((room, idx) => (
                            <li
                                key={idx}
                                style={{
                                    marginBottom: "5px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleRoomClick(room)}
                            >
                                {room.room}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedRoom && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #aaa",
                    borderRadius: "5px",
                }}
                >
                    <h2>Book {selectedRoom.room}</h2>
                    <p>
                        Floor: {selectedFloor} | Date: {bookingDate} | Time: {selectedTime}
                    </p>
                    <form onSubmit={handleBookingSubmit}>
                        {currentUser ? (
                            <p>Booking as: <strong>{(currentUserFullName && currentUserFullName !== "undefined") ? currentUserFullName : currentUser}</strong></p>
                            ) : (
                                <>
                                    <label htmlFor="bookingName">Your Name:</label>
                                    <br />
                                    <input
                                        type="text"
                                        id="bookingName"
                                        name="bookingName"
                                        value={bookingName}
                                        onChange={(e) => setBookingName(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            margin: "10px 0"
                                    }}
                                    />
                                </>
                            )}
                        <br/>
                        <button type="submit" style={{padding: "10px", width: "100%"}} disabled={submitting}>
                            {submitting ? "Processing..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>
            )}
            {bookingConfirmation && (
                <div style={{marginTop: "20px", color: "green", whiteSpace: "pre-line" }}>
                    {bookingConfirmation}
                </div>
            )}
        </div>
    );
}

export default Bookings