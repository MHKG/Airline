import React, { useState } from "react";
import axios from "axios";
import "./BookingPage.css";

const BookingPage = ({ selectedFlight, profile }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [age, setAge] = useState("");
	const [seats_booked, setSeatsBooked] = useState(1);

	const bookFlight = async () => {
		if (!selectedFlight) {
			alert("Please select a flight to book.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:8080/FlightController/book",
				{
					flight_number: selectedFlight.flight_number,
					seats_booked,
					customers: [
						{
							name,
							email,
							age: parseInt(age),
						},
					],
				}
			);

			if (response.data.success) {
				alert("Booking successful!");
			} else {
				alert("Booking failed. Please try again.");
			}
		} catch (error) {
			console.error("Error booking flight:", error);
			alert("An error occurred while booking the flight.");
		}
	};

	return (
		<div className="booking-container">
			{" "}
			<h2>Booking Details</h2>
			<div className="input-group">
				{" "}
				<label>Name:</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="input-group">
				{" "}
				<label>Email:</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="input-group">
				{" "}
				<label>Age:</label>
				<input
					type="number"
					value={age}
					onChange={(e) => setAge(e.target.value)}
				/>
			</div>
			<div className="input-group">
				{" "}
				<label>Seats Required:</label>
				<input
					type="number"
					value={seats_booked}
					onChange={(e) => setSeatsBooked(parseInt(e.target.value))}
				/>
			</div>
			<button onClick={bookFlight} className="button">
				Book Flight
			</button>{" "}
		</div>
	);
};

export default BookingPage;
