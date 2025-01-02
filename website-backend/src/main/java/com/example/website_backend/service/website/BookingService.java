package com.example.website_backend.service.website;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.client.UserClient;
import com.example.website_backend.dto.crm.BookingCreateDtoCrm;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.crm.UserForBookingDto;
import com.example.website_backend.dto.website.BookingCreateDto;
import com.example.website_backend.dto.website.UserDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.model.BookingStatus;
import com.example.website_backend.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BookingService {

    @Autowired
    private BookingRepository repository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private BookingClient bookingClient;


    public boolean checkUser(String telephone) {
        return userClient.existsUser(telephone);
    }

    // Create a new price
    public void createBooking(BookingCreateDto bookingDto) {
        try {
            if (bookingDto.getUser_id() == null || bookingDto.getUser_id().isEmpty())
                bookingDto.setUser_id(createUser(bookingDto.getUser()));
            else if (!checkUserForBooking(bookingDto.getUser_id()))
                throw new RuntimeException("User with ID " + bookingDto.getUser_id() + " not found or blocked.");

            repository.save(new Booking(
                    bookingDto.getCategory_id(),
                    bookingDto.getUser_id(),
                    bookingDto.getDrivers(),
                    bookingDto.getStart(),
                    bookingDto.getEnd(),
                    bookingDto.getPrice(),
                    BookingStatus.ACCEPTED,
                    bookingDto.getStartLocation(),
                    bookingDto.getEndLocation()
            ));

        } catch (Exception e) {
            log.warn("Category already exists");
            log.error("Error: ", e);
        }
    }

    public void confirmPayment(Long id) {
        Optional<Booking> existing = repository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Booking with ID " + id + " not found.");
        }
        Booking booking = existing.get();
        booking.set_advance_paid(true);

        repository.save(booking);

        BookingCreateDtoCrm bookingDto = new BookingCreateDtoCrm(
                booking.getId(),
                booking.getUser_id(),
                booking.getCategory_id(),
                booking.getDrivers(),
                booking.getStart(),
                booking.getEnd(),
                booking.getPrice(),
                booking.getStartLocation(),
                booking.getEndLocation(),
                false,
                booking.getCreated_at(),
                booking.is_advance_paid()
                );

        BookingDto bookingResponse = bookingClient.createBooking(bookingDto);
        booking.setCrm_booking_id(bookingResponse.getCrm_booking_id());

        repository.save(booking);
    }

    // Update an existing price
    public void updateBooking(Long id, BookingDto bookingDto) {
        Optional<Booking> existing = repository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Booking with ID " + id + " not found.");
        }
        Booking booking = existing.get();

        // Update the fields of the booking with the values from the DTO
        booking.setCategory_id(bookingDto.getCategory_id());
        booking.setUser_id(bookingDto.getUser_id());
        booking.setDrivers(bookingDto.getDrivers());
        booking.setStart(bookingDto.getStart());
        booking.setEnd(bookingDto.getEnd());
        booking.setPrice(bookingDto.getPrice());
        booking.setStatus(bookingDto.getStatus());
        booking.setStartLocation(bookingDto.getStartLocation());
        booking.setEndLocation(bookingDto.getEndLocation());
        booking.set_advance_paid(bookingDto.is_advance_paid());

        // Save the updated booking
        repository.save(booking);

        // Optionally log the update operation
        log.info("Booking with ID " + id + " successfully updated.");
    }

    // Delete a price
    public void deleteBooking(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Booking with ID " + id + " not found.");
        }
        repository.deleteById(id);
    }

    private boolean checkUserForBooking(String telephone) {
        UserForBookingDto check = userClient.existsUserForBooking(telephone);
        return check.isExists() && !check.isBlocked();
    }

    private String createUser(UserDto user){
        return userClient.createUser(user).getTelephone();
    }

    /**
     * Scheduled task to delete bookings older than 24 hours with is_advance_paid = false
     */
    @Scheduled(cron = "0 0 1 * * ?") // Runs daily at 01:00
    public void deleteUnpaidOldBookings() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        // Find bookings older than 24 hours and not paid
        List<Booking> bookingsToDelete = repository.findAllByCreatedAtBeforeAndIsAdvancePaidFalse(threshold);

        if (!bookingsToDelete.isEmpty()) {
            repository.deleteAll(bookingsToDelete);
            log.info("Deleted {} unpaid bookings older than 24 hours.", bookingsToDelete.size());
        } else {
            log.info("No unpaid bookings older than 24 hours found for deletion.");
        }
    }

    /**
     * Deletes all bookings where the end timestamp is more than 1 day in the past.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Runs daily at 02:00
    public void deleteExpiredBookings() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(1);

        // Find bookings where end is more than 1 day in the past
        List<Booking> expiredBookings = repository.findAllByEndBefore(threshold);

        if (!expiredBookings.isEmpty()) {
            repository.deleteAll(expiredBookings);
            log.info("Deleted {} expired bookings where the end time was more than 1 day ago.", expiredBookings.size());
        } else {
            log.info("No expired bookings found for deletion.");
        }
    }

    public List<BookingDto> getAll() {
        List<Booking> bookings = repository.findAll();
        return bookings.stream()
                .map(booking -> new BookingDto(
                        booking.getCrm_booking_id(),
                        booking.getId(),
                        booking.getUser_id(),
                        booking.getCategory_id(),
                        booking.getDrivers(),
                        booking.getStart(),
                        booking.getEnd(),
                        booking.getPrice(),
                        booking.getStatus(),
                        booking.getStartLocation(),
                        booking.getEndLocation(),
                        booking.getCreated_at(),
                        booking.is_advance_paid()))
                .collect(Collectors.toList());
    }
}
