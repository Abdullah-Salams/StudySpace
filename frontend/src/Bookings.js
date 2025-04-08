import React, { useState, useEffect } from 'react'

function Bookings() {

    const [selectedFloor, setSelectedFloor] = useState("1");
    const [selectedTime, setSelectedTime] = useState("8:00");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
        "15:30", "16:00", "16:30", "17:00"];

    const fetchRooms = async (floor, time) => {
        if (floor === "1") {
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/rooms?floor=${floor}&time=${encodeURIComponent(time)}`
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
    }

    useEffect(() => {
        if (selectedFloor === "1") {
            setAvailableRooms([]);
        } else {
            fetchRooms(selectedFloor, selectedTime);
        }
    }, [selectedFloor, selectedTime]);

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
                >
                    {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
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
                    <ul>
                        {availableRooms.map((room, idx) => (
                            <li key={idx}>{room.room}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
export default Bookings