package com.example.website_backend.service.sync;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.model.ChecklistEntry;
import com.example.website_backend.model.ChecklistItem;
import com.example.website_backend.model.Driver;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.repository.DriverRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BookingSyncService {

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private BookingRepository repository;

    @Autowired
    private DriverRepository driverRepository;

    @EventListener(ContextRefreshedEvent.class)
    @Async
    public void syncBookings() throws InterruptedException {
        while (true) {
            try {
                List<BookingDto> allDtos = bookingClient.getAll()
                        .collectList()
                        .block(Duration.ofMinutes(2));

                if (allDtos == null) {
                    log.warn("Booking stream was null; retrying...");
                    TimeUnit.MINUTES.sleep(1);
                    continue;
                }

                // Will hold CRM IDs of newly-created website bookings
                // Will hold the replies back to CRM (crm_id + website_id)
                List<BookingDto> acks = new ArrayList<>();

                for (BookingDto dto : allDtos) {
                    if (dto.getWebsite_booking_id() == null) {
                        // 1) map & persist new booking to get its ID
                        Booking fresh = dtoToEntity(new Booking(), dto);
                        Booking saved = repository.save(fresh);

                        // 2) save its drivers now that we have the website ID
                        if (dto.getDrivers() != null) {
                            List<Driver> drivers = dto.getDrivers().stream()
                                    .map(d -> new Driver(
                                            new Driver.DriverId(d.getTelephone(), saved.getId()),
                                            d.getFull_name()
                                    ))
                                    .toList();
                            driverRepository.saveAll(drivers);
                        }
                        acks.add(new BookingDto(dto.getCrm_booking_id(), saved.getId()));
                    } else {
                        // existing booking → update & re-save
                        repository.findById(dto.getWebsite_booking_id())
                                .ifPresent(existing -> {
                                    Booking updated = dtoToEntity(existing, dto);
                                    repository.save(updated);

                                    // (re)sync drivers too:
                                    driverRepository.deleteAllByBooking_id(updated.getId());
                                    if (dto.getDrivers() != null) {
                                        List<Driver> drivers = dto.getDrivers().stream()
                                                .map(d -> new Driver(
                                                        new Driver.DriverId(d.getTelephone(), updated.getId()),
                                                        d.getFull_name()
                                                ))
                                                .toList();
                                        driverRepository.saveAll(drivers);
                                    }
                                });
                    }
                }

                // 3) send all acks back in one call
                if (!acks.isEmpty()) {
                    bookingClient.receiveAll(acks);
                }

                log.info("Booking sync complete. Total fetched={}, new acks={}",
                        allDtos.size(), acks.size());
                break;
            } catch (Exception ex) {
                log.error("Error during booking synchronization; retrying in 1m…", ex);
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }

    /** copy core booking fields from DTO → entity */
    private Booking dtoToEntity(Booking entity, BookingDto dto) {
        entity.setCrm_booking_id(dto.getCrm_booking_id());
        entity.setCategory_id(dto.getCategory_id());
        entity.setUser_id(dto.getUser_id());
        entity.setStart(dto.getStart());
        entity.setEnd(dto.getEnd());
        entity.setPrice(dto.getPrice());
        entity.setStartLocation(dto.getStartLocation());
        entity.setEndLocation(dto.getEndLocation());
        entity.setCreated_at(dto.getCreated_at());
        entity.set_advance_paid(dto.is_advance_paid());
        entity.setFlight(dto.getFlight());
        entity.setNotes(dto.getNotes());
        entity.setNumberOfPeople(dto.getNumberOfPeople());
        entity.setChecklist(
                dto.getChecklist().stream()
                        .map(e -> new ChecklistEntry(ChecklistItem.valueOf(e.getItem()), e.getQuantity()))
                        .collect(Collectors.toSet())
        );
        return entity;
    }
}
