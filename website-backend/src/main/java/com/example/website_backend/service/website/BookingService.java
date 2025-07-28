package com.example.website_backend.service.website;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.client.UserClient;
import com.example.website_backend.dto.crm.BookingCreateDtoCrm;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.crm.UserForWebsiteDto;
import com.example.website_backend.dto.website.BookingCreateDto;
import com.example.website_backend.dto.website.UserDto;
import com.example.website_backend.flags.BitMask;
import com.example.website_backend.flags.UserFlags;
import com.example.website_backend.model.Booking;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.service.crm.UserClientService;
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
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private UserClientService userClientService;


    // Create a new price
    public BookingDto createBooking(BookingCreateDto bookingDto) {
        try {
            if (bookingDto.getUser_id() == null || bookingDto.getUser_id().isEmpty())
                throw new Exception("User id is empty");

            Booking booking = repository.save(new Booking(
                    bookingDto.getCategory_id(),
                    bookingDto.getUser_id(),
                    bookingDto.getDrivers(),
                    bookingDto.getStart(),
                    bookingDto.getEnd(),
                    bookingDto.getPrice(),
                    bookingDto.getStartLocation(),
                    bookingDto.getEndLocation()
            ));

            return new BookingDto(
                    booking.getCrm_booking_id(),
                    booking.getId(),
                    booking.getUser_id(),
                    booking.getCategory_id(),
                    booking.getDrivers(),
                    booking.getStart(),
                    booking.getEnd(),
                    booking.getPrice(),
                    booking.getStartLocation(),
                    booking.getEndLocation(),
                    booking.getCreated_at(),
                    booking.is_advance_paid()
            );

        } catch (Exception e) {
            log.warn("Category already exists");
            log.error("Error: ", e);
            throw new RuntimeException(e);
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
                booking.getStart(),
                booking.getEnd(),
                booking.getDrivers(),
                booking.getPrice(),
                booking.getStartLocation(),
                booking.getEndLocation(),
                booking.getCreated_at(),
                booking.is_advance_paid()
        );

        bookingClient.createBooking(bookingDto);

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

    /**
     * @return empty list if everything required is present,
     *         null if user doesn’t exist (caller decides what to do)
     */
    public List<String> checkUserForBooking(String telephone) {
        UserForWebsiteDto u = userClientService.usersForWebsite().stream()
                .filter(x -> x.getTelephone().equals(telephone))
                .findFirst()
                .orElse(null);

        if (u == null) return null;

        int f = u.getFlags();
        List<String> missing = new java.util.ArrayList<>();

        // define what you actually require for a website booking:
        if (!BitMask.isSet(f, UserFlags.HAS_NAME))              missing.add("name");
        if (!BitMask.isSet(f, UserFlags.HAS_LAST_NAME))         missing.add("last_name");
        if (!BitMask.isSet(f, UserFlags.HAS_EMAIL))             missing.add("email");
        if (!BitMask.isSet(f, UserFlags.HAS_COUNTRY))           missing.add("country");
        if (!BitMask.isSet(f, UserFlags.HAS_DRIVER_LICENSE))    missing.add("driver_license");

        // If company flag is on, maybe require VAT/company_name
        if (BitMask.isSet(f, UserFlags.IS_COMPANY)) {
            if (!BitMask.isSet(f, UserFlags.HAS_VAT_NUMBER))    missing.add("vat_number");
            if (!BitMask.isSet(f, UserFlags.HAS_COMPANY_NAME))  missing.add("company_name");
        }

        return missing;
    }


    public String createUser(UserDto user){
        return userClient.createUser(user).getTelephone();
    }

    /**
     * Scheduled task to delete bookings older than 24 hours with is_advance_paid = false
     */
    //@Scheduled(cron = "0 0 1 * * ?") // Runs daily at 01:00
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
                        booking.getStartLocation(),
                        booking.getEndLocation(),
                        booking.getCreated_at(),
                        booking.is_advance_paid()))
                .collect(Collectors.toList());
    }

}