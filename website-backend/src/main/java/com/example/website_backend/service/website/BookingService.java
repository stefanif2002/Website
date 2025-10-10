package com.example.website_backend.service.website;

import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.crm.DriverDto;
import com.example.website_backend.dto.website.*;
import com.example.website_backend.model.*;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.repository.DiscountCouponRepository;
import com.example.website_backend.repository.DriverRepository;
import com.example.website_backend.service.crm.UserService;
import com.example.website_backend.service.helper.OutboxEventService;
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
    private DriverRepository driverRepository;

    @Autowired
    private OutboxEventService outboxEventService;

    @Autowired
    private DiscountCouponRepository discountCouponRepository;

    @Autowired
    private UserService userService;


    // Create a new price
    public Long createBooking(BookingCreateDto bookingDto) {
        try {
            if (bookingDto.getUserId() == null || bookingDto.getUserId().isEmpty())
                throw new Exception("User id is empty");

            Booking booking = new Booking(
                    bookingDto.getCategoryId(),
                    bookingDto.getUserId(),
                    bookingDto.getStart(),
                    bookingDto.getEnd(),
                    bookingDto.getPrice(),
                    bookingDto.getStartLocation(),
                    bookingDto.getEndLocation(),
                    bookingDto.getNumberOfPeople(),
                    bookingDto.getFlight(),
                    bookingDto.getNotes()
            );

            if (bookingDto.getChecklist() != null) {
                booking.setChecklist(
                        bookingDto.getChecklist().stream()
                                .map(e -> new ChecklistEntry(ChecklistItem.valueOf(e.getItem()), e.getQuantity()))
                                .collect(Collectors.toSet())
                );
            }

            booking = repository.save(booking);

            createDrivers(bookingDto.getDrivers(), booking.getId());

            outboxEventService.push(bookingDto, booking.getId(), "BookingCreated");

            log.info("Booking created with ID: {}", booking.getId());

            return booking.getId();

        } catch (Exception e) {
            log.warn("Booking already exists");
            log.error("Error: ", e);
            throw new RuntimeException(e);
        }

    }

    public void createDrivers (List<DriverDto> driverDtos, Long bookingId) {
        List<Driver> entities = driverDtos.stream()
                .map(d -> new Driver(
                        new Driver.DriverId(d.getTelephone(), bookingId),
                        d.getFull_name()
                ))
                .toList();

        driverRepository.saveAll(entities);
    }

    public void confirmPayment(Long id) {
        Optional<Booking> existing = repository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Booking with ID " + id + " not found.");
        }
        Booking booking = existing.get();
        booking.set_advance_paid(true);

        repository.save(booking);

        outboxEventService.readyToProcess(id);
    }

    public void createUser(UserDto user){
        userService.createUserInternal(user);
        outboxEventService.push(user, user.getTelephone(), "UserCreated");
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
                        //booking.getDrivers(),
                        booking.getStart(),
                        booking.getEnd(),
                        booking.getPrice(),
                        booking.getStartLocation(),
                        booking.getEndLocation(),
                        booking.getCreated_at(),
                        booking.is_advance_paid()))
                .collect(Collectors.toList());
    }


    public float validateDiscountCode(ValidateCouponRequest req) {
        DiscountCoupon c = discountCouponRepository.findIfOverlaps(
                req.getCode(),
                req.getCategoryId(),
                req.getStartDate(),
                req.getEndDate()
        );

        if (c == null) {
            return 0.0f;
        }


//        LocalDate resStart = req.getStartDate();
//        LocalDate resEnd   = req.getEndDate();
//        LocalDate coupStart = c.getStartDate();
//        LocalDate coupEnd   = c.getEndDate();
//
//        // treat endDate as exclusive to match your 5-day example
//        long totalResDays = ChronoUnit.DAYS.between(resStart, resEnd);
//        long overlapDays  = ChronoUnit.DAYS.between(
//                resStart.isAfter(coupStart) ? resStart : coupStart,
//                resEnd.isBefore(coupEnd)    ? resEnd   : coupEnd
//        );
//
//        if (totalResDays <= 0 || overlapDays <= 0) {
//            throw new RuntimeException("No applicable days for discount");
//        }
//
//        float ratio = (float) overlapDays / (float) totalResDays;
//        return c.getDiscountPercentage() * ratio;

        return c.getDiscountPercentage();

    }

    public void applyDiscount(String bookingId, ApplyDiscountRequest req) {
        Optional<Booking> existing = repository.findById(Long.valueOf(bookingId));
        if (existing.isEmpty()) {
            throw new RuntimeException("Booking with ID " + bookingId + " not found.");
        }
        Booking booking = existing.get();
        booking.setPrice(req.getDiscountedTotal());
        repository.save(booking);
    }

}