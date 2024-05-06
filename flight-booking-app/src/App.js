import "./App.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FlightSearch = () => {
    const [departureLocation, setDepartureLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState(new Date());
    const [seatsRequired, setSeatsRequired] = useState(1);
    const [flights, setFlights] = useState([]);
    const dataSize = flights.length;
    const [loading, setLoading] = useState(false);
    const datePickerRef = useRef();
    const [message, setMessage] = useState("");

    const searchFlights = async () => {
        setLoading(true);
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await axios.get(
                "http://localhost:8080/FlightController/flights",
                {
                    params: {
                        departureLocation,
                        destination,
                        date: formattedDate,
                        seatsRequired,
                    },
                }
            );

            const dataSize = Object.keys(response.data).length;
            console.log("HH");
            if (dataSize === 0) {
                setMessage("No flights found for the selected date, source and destination.");
            } else {
                setMessage("Flight number");
            }

            setFlights(response.data);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
        setLoading(false);
    };

    return (
        <div className="flight-search-container">
            <h2>Search Flights</h2>
            <div className="input-group">
                <label htmlFor="departureLocation">Departure Location:</label>
                <input
                    type="text"
                    id="departureLocation"
                    value={departureLocation}
                    onChange={(e) => setDepartureLocation(e.target.value)}
                    placeholder="Enter departure location"
                />
            </div>
            <div className="input-group">
                <label htmlFor="destination">Destination:</label>
                <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                />
            </div>
            <div className="input-group">
                <label htmlFor="date">Date:</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    ref={datePickerRef}
                />
            </div>
            <div className="input-group">
                <label htmlFor="seatsRequired">Seats Required:</label>
                <input
                    type="number"
                    id="seatsRequired"
                    value={seatsRequired}
                    onChange={(e) => setSeatsRequired(parseInt(e.target.value))}
                    min={1}
                    max={10}
                />
            </div>
            <button
                className="search-button"
                onClick={searchFlights}
                disabled={loading}
            >
                {loading ? "Searching..." : "Search Flights"}
            </button>
            {<div className="message">{message}</div>}
            <ul className="flight-list">
                {flights.map((flight) => (
                    <li key={flight.flight_number}>
                        {flight.flight_number} - {flight.departure_time} - ₹
                        {flight.fare}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightSearch;
