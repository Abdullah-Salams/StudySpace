import React, { useState, useEffect } from 'react'

function Bookings() {

  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/bookings")
        .then((res) => res.json())
        .then((data) => {
            console.log("Bookings received:", data);
            if (data && data.bookings && Array.isArray(data.bookings)) {
                setBookings(data.bookings);
            } else {
                console.error("Invalid data format:", data);
                setBookings([]);
            }
        })
        .catch((error) => console.error("Error while fetching bookings:", error));
  }, [])

  return (
    <div>

        <h1>Study Room Bookings</h1>

        {bookings.length === 0 ? (
            <p>Loading...</p>
            ): (
                bookings.map((bookings, i) => (
                    <p key={i}>{JSON.stringify(bookings)}</p>
                    ))
            )}

    </div>
  )
}

  export default Bookings