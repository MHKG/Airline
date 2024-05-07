import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

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
    const datePickerRef = useRef();

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
        onError: (error) => console.log("Login Failed:", error)
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
                <button onClick={login} style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <img src="https://1000logos.net/wp-content/uploads/2016/11/New-Google-Logo.jpg" alt="Google Logo" style={{marginRight: "8px", width: "24px", height: "24px"}}/>
                    <span>Continue with Google</span>
                </button>
            )}

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
                        <h4 style={{ whiteSpace: "pre" }}>
                            Flight Number - Departure Time -{"\t"} Fare
                        </h4>
                        <ul className="flight-list">
                            {flights.map((flight) => (
                                <li
                                    key={flight.flight_number}
                                    style={{ whiteSpace: "pre" }}
                                >
                                    {" "}
                                    {flight.flight_number} {"\t"}
                                    {"\t"} - {"\t"} {flight.departure_time}{" "}
                                    {"\t"}
                                    {"\t"} -{"\t"} ₹{flight.fare}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
