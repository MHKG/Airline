//FlightController.java

package com.example.controller;

import com.example.dto.FlightDTO;
import com.example.entity.Flight;
import com.example.service.FlightSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="/FlightController")
public class FlightController {

	@Autowired
	private FlightSearchService flightSearchService;

	@GetMapping("/flights")
	public List<Flight> searchFlights(
			@RequestParam String departureLocation,
			@RequestParam String destination,
			@RequestParam String date,
			@RequestParam int seatsRequired) {
		return flightSearchService.searchFlights(departureLocation, destination, date, seatsRequired);
	}
}
