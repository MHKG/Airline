package com.example.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flight_number;
    private int seats_booked;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Customer> customers;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFlight_number() {
        return flight_number;
    }

    public void setFlight_number(String flight_number) {
        this.flight_number = flight_number;
    }

    public int getSeats_booked() {
        return seats_booked;
    }

    public void setSeats_booked(int seats_booked) {
        this.seats_booked = seats_booked;
    }

    public Customer[] getCustomers() {
        return customers.toArray(new Customer[0]);
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }
}
