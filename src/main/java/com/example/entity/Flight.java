//Flight.java

package com.example.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "flight")
public class Flight {

	@Column private String flight_number;
	@Column private String source;
	@Column private String destination;
	@Column private String departure_time;
	@Column private int available_seats;
	@Column private double fare;
	@Column private String date_of_journey;

	// Constructor, getters, and setters
	public Flight(String flight_number, String source, String destination, String departure_time, int available_seats, double fare, String date_of_journey) {
		this.flight_number = flight_number;
		this.source = source;
		this.destination = destination;
		this.departure_time = departure_time;
		this.available_seats = available_seats;
		this.fare = fare;
		this.date_of_journey = date_of_journey;
	}

	public Flight() {

	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public String getFlight_number() {
		return flight_number;
	}

	public void setFlight_number(String flight_number) {
		this.flight_number = flight_number;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getDeparture_time() {
		return departure_time;
	}

	public void setDeparture_time(String departure_time) {
		this.departure_time = departure_time;
	}

	public int getAvailable_seats() {
		return available_seats;
	}

	public void setAvailable_seats(int available_seats) {
		this.available_seats = available_seats;
	}

	public double getFare() {
		return fare;
	}

	public void setFare(double fare) {
		this.fare = fare;
	}

	public String getDate_of_journey() {
		return date_of_journey;
	}

	public void setDate_of_journey(String date_of_journey) {
		this.date_of_journey = date_of_journey;
	}
}