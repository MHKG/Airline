//FlightDTO.java

package com.example.dto;

import com.example.entity.Flight;

public class FlightDTO {

	private String flightNumber;
	private String departureTime;
	private double fare;

	public FlightDTO(Flight flight) {
		this.flightNumber = flight.getFlight_number();
		this.departureTime = flight.getDeparture_time();
		this.fare = flight.getFare();
	}

	// Getters
	public String getFlightNumber() {
		return flightNumber;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public double getFare() {
		return fare;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}

	public void setFare(double fare) {
		this.fare = fare;
	}
}
