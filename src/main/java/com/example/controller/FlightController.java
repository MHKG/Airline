//FlightController.java

package com.example.controller;

import com.example.entity.Booking;
import com.example.entity.Flight;
import com.example.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(value="/FlightController")
public class FlightController {

	@Autowired
	private FlightService flightService;

	@RequestMapping(value = "/flights", method = RequestMethod.GET)
	public List<Flight> searchFlights(
			@RequestParam String departureLocation,
			@RequestParam String destination,
			@RequestParam String date,
			@RequestParam int seatsRequired) {
		return flightService.searchFlights(departureLocation, destination, date, seatsRequired);
	}

	@RequestMapping(value = "/book", method = RequestMethod.POST)
	public ResponseEntity<?> bookFlight(@RequestBody Booking booking) {
		// Assuming you have a service to handle the booking logic
		boolean isBookingSuccessful = flightService.bookFlight(
				booking.getFlightNumber(),
				booking.getSeatsRequired(),
				booking.getCustomers()
		);

		if (isBookingSuccessful) {
			return ResponseEntity.ok(Collections.singletonMap("success", true));
		} else {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Collections.singletonMap("success", false));
		}
	}
}
