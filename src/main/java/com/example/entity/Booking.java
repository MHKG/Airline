package com.example.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "booking")
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String flightNumber;
	private int seatsRequired;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Customer> customers;

	// Getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public int getSeatsRequired() {
		return seatsRequired;
	}

	public void setSeatsRequired(int seatsRequired) {
		this.seatsRequired = seatsRequired;
	}

	public Customer[] getCustomers() {
		return customers.toArray(new Customer[0]);
	}

	public void setCustomers(List<Customer> customers) {
		this.customers = customers;
	}
}
