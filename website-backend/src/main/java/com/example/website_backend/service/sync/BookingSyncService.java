package com.example.website_backend.service.sync;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.dto.BookingDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class BookingSyncService {

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private BookingRepository repository;

    @EventListener(ContextRefreshedEvent.class)
    @Async  // Ensure asynchronous execution
    public void syncBookings() throws InterruptedException {
        TimeUnit.MINUTES.sleep(1); // Delay to avoid early startup conflicts

        while (true) {
            try {
                // Fetch all bookings from the booking service
                List<BookingDto> result = bookingClient.getAll();

                if (result != null) {
                    List<Booking> newBookings = new ArrayList<>();

                    for (BookingDto dto : result) {
                        // Check if the booking already exists by website_booking_id
                        if (dto.getWebsite_booking_id() == null) {


                            // Map the DTO to the Booking entity, excluding website_booking_id
                            Booking booking = makeBooking(dto);

                            newBookings.add(booking); // Add to new bookings list
                        }
                    }

                    // Save only new bookings
                    repository.saveAll(newBookings);

                    log.info("Successfully synchronized bookings. New bookings: {}", newBookings.size());
                    break; // Exit the loop if successful
                }

            } catch (Exception e) {
                log.error("Error during booking synchronization. Retrying in 1 minute...", e);
                TimeUnit.MINUTES.sleep(1); // Retry after 1 minute
            }
        }
    }

    private Booking makeBooking(BookingDto dto) {
        Booking booking = new Booking();
        booking.setCrm_booking_id(dto.getCrm_booking_id());
        booking.setCategory_id(dto.getCategory_id());
        booking.setUser_id(dto.getUser_id());
        booking.setDrivers(dto.getDrivers());
        booking.setStart(dto.getStart());
        booking.setEnd(dto.getEnd());
        booking.setPrice(dto.getPrice());
        booking.setStatus(dto.getStatus());
        booking.setStartLocation(dto.getStartLocation());
        booking.setEndLocation(dto.getEndLocation());
        booking.setCreated_at(dto.getCreated_at());
        booking.set_advance_paid(dto.is_advance_paid());
        return booking;
    }

}
