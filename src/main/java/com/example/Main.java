//Main.java

package com.example;

import com.example.entity.Customer;
import com.example.entity.Flight;
import com.example.service.FlightSearchService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.util.List;
import java.util.Scanner;


// Main class for testing flight search and booking
@SpringBootApplication
public class Main {
	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(Main.class, args);
		FlightSearchService flightSearchService = context.getBean(FlightSearchService.class);
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter the number of seats you want to book: ");
		int seats_to_book = sc.nextInt();
		sc.nextLine();
		String name = null;
		String email = null;
		int age = 0;
		Customer[] customers = new Customer[seats_to_book];
		for(int i = 0; i < seats_to_book; i++) {
			System.out.print("Enter your name: ");
			name = sc.nextLine();
			System.out.print("Enter your email: ");
			email = sc.nextLine();
			System.out.print("Enter your age: ");
			age = sc.nextInt();
			sc.nextLine(); // Consume the newline character
			customers[i] = new Customer(name, email, age);
		}
		System.out.print("Enter the location from where you want to book flight: ");
		String source = sc.nextLine();
		System.out.print("Enter the location where you want to go: ");
		String destination = sc.nextLine();
		System.out.print("Enter date (YYYY-MM-DD): ");
		String date_of_journey = sc.nextLine();
		List<Flight> availableFlights = flightSearchService.searchFlights(source, destination, date_of_journey, seats_to_book);

		if (availableFlights.isEmpty()) {
			System.out.println("No flights available for the given criteria.");
		} else {
			System.out.println("Available flights:");
			for (Flight flight : availableFlights) {
				System.out.println(flight.getFlight_number() + " - " + flight.getDeparture_time() + " - " + flight.getFare());
			}

			// Example booking: Book the first available flight
			System.out.println("Enter the flight number you want to book: ");
			Flight selectedFlight = flightSearchService.getByFlightNumber(sc.nextLine());
			boolean isBookingSuccessful = flightSearchService.bookFlight(selectedFlight, seats_to_book, customers);
			if (isBookingSuccessful) {
				System.out.println("Booking successful for flight: " + selectedFlight.getFlight_number());
			} else {
				System.out.println("Booking failed. No seats available for the selected flight.");
			}
		}
	}
}