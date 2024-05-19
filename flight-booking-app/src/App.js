import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import BookingPage from "./BookingPage";

function App() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [departureLocation, setDepartureLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState(new Date());
    const [seatsRequired, setSeatsRequired] = useState(1);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedFlight, setSelectedFlight] = useState(null);
    const datePickerRef = useRef();
    const [showBookingPage, setShowBookingPage] = useState(false);

    const handleBookClick = () => {
        if (!selectedFlight) {
            alert("Please select a flight to book.");
            return;
        }
        setShowBookingPage(true);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios
                .get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: "application/json",
                        },
                    }
                )
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            localStorage.setItem("user", JSON.stringify(codeResponse));
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    const logOut = () => {
        googleLogout();
        localStorage.removeItem("user");
        setUser(null);
        setProfile(null);
    };

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
            if (dataSize === 0) {
                setMessage(
                    "No flights found for the selected date, source, and destination."
                );
            } else {
                setMessage("");
            }
            setFlights(response.data);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="login-container">
                {profile ? (
                    <div>
                        <img src={profile.picture} alt="user image" />
                        <h3>User Logged in</h3>
                        <p>Name: {profile.name}</p>
                        <p>Email Address: {profile.email}</p>
                        <br />
                        <br />
                        <button onClick={logOut}>Log out</button>
                    </div>
                ) : (
                    <button onClick={login} className="login-button">
                        <img
                            src="https://1000logos.net/wp-content/uploads/2016/11/New-Google-Logo.jpg"
                            alt="Google Logo"
                            className="google-logo"
                        />
                        <span>Continue with Google</span>
                    </button>
                )}
            </div>

            {showBookingPage ? (
                <BookingPage
                    selectedFlight={selectedFlight}
                    profile={profile}
                />
            ) : (
                <div className="flight-search-container">
                    <h2>Search Flights</h2>
                    <div className="input-group">
                        <label htmlFor="departureLocation">
                            Departure Location:
                        </label>
                        <input
                            type="text"
                            id="departureLocation"
                            value={departureLocation}
                            onChange={(e) =>
                                setDepartureLocation(e.target.value)
                            }
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
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            ref={datePickerRef}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="seatsRequired">Seats Required:</label>
                        <input
                            type="number"
                            id="seatsRequired"
                            value={seatsRequired}
                            onChange={(e) =>
                                setSeatsRequired(parseInt(e.target.value))
                            }
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
                    <div className="message">{message}</div>
                    {flights.length > 0 && (
                        <div className="flight-list-container">
                            <div className="flight-details">
                                <span>Flight Number</span>
                                <span>Departure Time</span>
                                <span>Fare</span>
                            </div>
                            <ul className="flight-list">
                                {flights.map((flight) => (
                                    <li
                                        key={flight.flight_number}
                                        className={
                                            selectedFlight &&
                                            selectedFlight.flight_number ===
                                                flight.flight_number
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="selectedFlight"
                                            value={flight.flight_number}
                                            checked={
                                                selectedFlight &&
                                                selectedFlight.flight_number ===
                                                    flight.flight_number
                                            }
                                            onChange={() =>
                                                setSelectedFlight(flight)
                                            }
                                            className="radio-button"
                                        />
                                        <div className="flight-details">
                                            <span>{flight.flight_number}</span>
                                            <span>{flight.departure_time}</span>
                                            <span>₹{flight.fare}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleBookClick}
                                disabled={!selectedFlight}
                            >
                                Book Selected Flight
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
