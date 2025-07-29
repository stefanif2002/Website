package com.example.website_backend.service.sync;

import com.example.website_backend.client.BookingClient;
import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.repository.BookingRepository;
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

@Service
@Slf4j
public class BookingSyncService {

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private BookingRepository repository;

    @EventListener(ContextRefreshedEvent.class)
    @Async
    public void syncBookings() throws InterruptedException {
        // give everything else a chance to come up
        //TimeUnit.MINUTES.sleep(1);

        while (true) {
            try {
                // 1) fetch the entire stream into a List (blocks until complete or timeout)
                List<BookingDto> allDtos = bookingClient.getAll()
                        .collectList()
                        .block(Duration.ofMinutes(2));

                if (allDtos == null) {
                    log.warn("Booking stream was null; retrying...");
                    TimeUnit.MINUTES.sleep(1);
                    continue;
                }

                //repository.deleteAllWithCRMId();

                List<Booking> toSave = new ArrayList<>();
                List<Long>   newlyCreatedCrmIds = new ArrayList<>();

                // 2) detect new vs existing
                for (BookingDto dto : allDtos) {
                    if (dto.getWebsite_booking_id() == null) {
                        // brand-new: map and remember crm id so we can send back the new website ID
                        Booking b = dtoToEntity(new Booking(), dto);
                        toSave.add(b);
                        newlyCreatedCrmIds.add(dto.getCrm_booking_id());
                    } else {
                        // existing: fetch, update, and re-save
                        repository.findById(dto.getWebsite_booking_id())
                                .ifPresent(existing -> {
                                    toSave.add(dtoToEntity(existing, dto));
                                });
                    }
                }

                // 3) persist all changes (new + updated)
                repository.saveAll(toSave);

                // 4) push back the newly created website IDs to CRM
                if (!newlyCreatedCrmIds.isEmpty()) {
                    List<Booking> createdEntities =
                            repository.findAllByCRM(newlyCreatedCrmIds);

                    // map back to lightweight DTOs (only crm + website IDs)
                    List<BookingDto> replyDtos = new ArrayList<>(createdEntities.size());
                    for (Booking b : createdEntities) {
                        BookingDto ack = new BookingDto();
                        ack.setCrm_booking_id(b.getCrm_booking_id());
                        ack.setWebsite_booking_id(b.getId());
                        replyDtos.add(ack);
                    }

                    bookingClient.receiveAll(replyDtos);
                }

                log.info("Booking sync complete. Total fetched={}, saved={}",
                        allDtos.size(), toSave.size());
                break;  // done
            } catch (Exception ex) {
                log.error("Error during booking synchronization; retrying in 1m…", ex);
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }

    /** Copy all fields from DTO into the entity (new or existing). */
    private Booking dtoToEntity(Booking entity, BookingDto dto) {
        entity.setCrm_booking_id(dto.getCrm_booking_id());
        entity.setCategory_id(dto.getCategory_id());
        entity.setUser_id(dto.getUser_id());
        //entity.setDrivers(dto.getDrivers());
        entity.setStart(dto.getStart());
        entity.setEnd(dto.getEnd());
        entity.setPrice(dto.getPrice());
        entity.setStartLocation(dto.getStartLocation());
        entity.setEndLocation(dto.getEndLocation());
        entity.setCreated_at(dto.getCreated_at());
        entity.set_advance_paid(dto.is_advance_paid());
        return entity;
    }
}
