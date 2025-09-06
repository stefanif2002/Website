package com.example.website_backend.service.website;

import com.example.website_backend.dto.crm.AvailabilityCreateDto;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.dto.website.AvailabilityDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.service.crm.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AvailabilityService {

    @Autowired
    private BookingRepository repository;

    @Autowired
    private CategoryService categoryService;

    public List<AvailabilityDto> searchAvailability(String name, String type, String fuel, Boolean automatic, Integer seats, LocalDateTime start, LocalDateTime end) {

        if (start == null || end == null)
            throw new RuntimeException();

        List<AvailabilityDto> finals = new ArrayList<>();

        List<Object[]> results = repository.CheckMultipleAvailabilityInTimeFrame3(name, type, fuel, automatic, seats, start, end);

        HashMap<Long,CategoryDto> categoryMap = categoryService.getMap();

        for (Object[] result : results) {

            if (((Number) result[1]).intValue() != 0) {
                Long category_id = ((Number) result[0]).longValue();

                float average = ((Number) result[3]).floatValue();
                float total = ((Number) result[2]).floatValue();

                finals.add(new AvailabilityDto(categoryMap.get(category_id), total, average));
            }

        }

        return finals;

    }



    public void createAvailability(AvailabilityCreateDto bookingDto) {
        Booking booking = new Booking();
        booking.setCategory_id(bookingDto.getCategory_id());
        booking.setStart(bookingDto.getStart());
        booking.setEnd(bookingDto.getEnd());

        // Save the new booking
        repository.save(booking);

        // Optionally log the creation operation
        log.info("New booking created with ID " + booking.getId());
    }

    public void updateAvailability(AvailabilityCreateDto bookingDto) {
        Optional<Booking> existing = repository.findById(bookingDto.getId());
        if (existing.isEmpty()) {
            throw new RuntimeException("Booking with ID " + bookingDto.getId() + " not found.");
        }
        Booking booking = existing.get();

        // Update the fields of the booking with the values from the DTO
        booking.setCategory_id(bookingDto.getCategory_id());
        booking.setStart(bookingDto.getStart());
        booking.setEnd(bookingDto.getEnd());

        // Save the updated booking
        repository.save(booking);

        // Optionally log the update operation
        log.info("Booking with ID " + bookingDto.getId() + " successfully updated.");
    }


    public void deleteAvailability(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Booking with ID " + id + " not found.");
        }
        repository.deleteById(id);
    }

    public void alterAvailability(AvailabilityCreateDto availabilityDto) {
        switch (availabilityDto.getEventType()) {
            case "AvailabilityAdded" -> createAvailability(availabilityDto);
            case "AvailabilityUpdated" -> updateAvailability(availabilityDto);
            case "AvailabilityDeleted" -> deleteAvailability(availabilityDto.getId());
            default -> throw new RuntimeException("Unknown event type: " + availabilityDto.getEventType() + " for availability ID " + availabilityDto.getId());

        }
    }

}
