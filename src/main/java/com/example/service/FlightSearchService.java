//FlightSearchService.java

package com.example.service;

import com.example.entity.Customer;
import com.example.entity.Flight;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FlightSearchService {

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private Environment environment;

	public FlightSearchService(EntityManager entityManager, Environment environment) {
		this.entityManager = entityManager;
		this.environment = environment;
	}

	public Flight getByFlightNumber(String flight_number) {
		Query query = entityManager.createQuery(environment.getProperty("findByFlightNumber"), Flight.class).setParameter("flight_number", flight_number);
		return (Flight) query.getSingleResult();
	}

	// Method to search for available flights based on user input
	public List<Flight> searchFlights(String source, String destination, String date_of_journey, int seats_required) {
		Query query = entityManager.createQuery(environment.getProperty("findAllFlights"), Flight.class);
		query.setParameter("source", source);
		query.setParameter("destination", destination);
		query.setParameter("date_of_journey", date_of_journey);
		query.setParameter("seats_required", seats_required);
		return query.getResultList();
	}

	// Method to book a flight
	public boolean bookFlight(Flight flight, int seats_required, Customer[] customers) {
		if (flight.getAvailable_seats() >= seats_required) {
			// Insert booking details into the Booking table
			String insertBookingQuery = "INSERT INTO Booking (flight_number, seats_booked,customer_id, booking_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
			Query insertBooking = entityManager.createNativeQuery(insertBookingQuery);
			insertBooking.setParameter(1, flight.getFlight_number());
			insertBooking.setParameter(2, seats_required);

			// Set the flight number for each customer
			for (Customer customer : customers) {
				entityManager.persist(customer);
				insertBooking.setParameter(3, customer.getId());
			}
			insertBooking.executeUpdate();

			// Reduce available seats and update the database
			Query decrementSeatQuery = entityManager.createQuery(environment.getProperty("decrementSeat"))
					.setParameter("seats_required", seats_required)
					.setParameter("flight_number", flight.getFlight_number());
			decrementSeatQuery.executeUpdate();

			return true;
		}
		return false;
	}
}
