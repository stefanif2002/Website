package com.example.website_backend.service.helper;


import com.example.website_backend.client.BookingClient;
import com.example.website_backend.client.PaymentClient;
import com.example.website_backend.client.UserClient;
import com.example.website_backend.dto.crm.BookingCreateDtoCrm;
import com.example.website_backend.dto.crm.CreatePaymentRequestDto;
import com.example.website_backend.dto.crm.DriverDto;
import com.example.website_backend.dto.website.ChecklistItemDto;
import com.example.website_backend.dto.website.EmailDto;
import com.example.website_backend.dto.website.UserDto;
import com.example.website_backend.model.Booking;
import com.example.website_backend.model.Driver;
import com.example.website_backend.model.OutboxEvent;
import com.example.website_backend.repository.BookingRepository;
import com.example.website_backend.repository.DriverRepository;
import com.example.website_backend.repository.OutboxEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxEventService {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private PaymentClient paymentClient;

    @Autowired
    private EmailService emailService;


    public void push(Object dto, Long id, String eventType) {
        OutboxEvent e = new OutboxEvent();
        e.setAggregateId(id);
        mapObject(dto, eventType, e);
    }

    public void push(Object dto, String id, String eventType) {
        OutboxEvent e = new OutboxEvent();
        e.setAggregateStringId(id);
        mapObject(dto, eventType, e);
    }

    public void readyToProcess(Long id) {
        List<OutboxEvent> events = outboxEventRepository
                .findAllByAggregateId(id);
        for (OutboxEvent e : events) {
            e.setReadyToProcess(true);
            outboxEventRepository.save(e);
        }
    }

    private void mapObject(Object dto, String eventType, OutboxEvent e) {
        e.setAggregateType(eventType);
        e.setEventType(eventType);
        e.setEventCreator("system");
        try {
            e.setPayload(objectMapper.writeValueAsString(dto));
        } catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
        e.setCreatedAt(LocalDateTime.now());
        e.setProcessed(false);
        e.setReadyToProcess(false);
        if (eventType.equals("UserCreated"))
            e.setReadyToProcess(true);
        outboxEventRepository.save(e);
    }



    public List<DriverDto> createDriversDto (Long bookingId) {
        List<Driver> entities = driverRepository.findAllByBooking_id(bookingId);
        return entities.stream()
                .map(d -> new DriverDto(
                        d.getId().getTelephone(),
                        d.getFullName()
                ))
                .toList();
    }

    /**
     * Scheduled task that periodically polls the outbox table and publishes unprocessed Booking-related events to RabbitMQ.
     */
    @Scheduled(fixedDelay = 15_000)
    @Transactional
    public void publishOutboxEvents() {

        List<OutboxEvent> events = outboxEventRepository
                .findByProcessedFalse(List.of("BookingCreated", "UserCreated", "PaymentCreated", "BookingConfirmationEmail"));

        log.info("Found {} unprocessed outbox events", events.size());

        for (OutboxEvent event : events) {
            try {

                switch (event.getEventType()) {
                    case "BookingCreated" -> {

                        Booking booking = bookingRepository.findById(event.getAggregateId())
                                .orElseThrow();
                        BookingCreateDtoCrm dto = new BookingCreateDtoCrm(
                                booking.getId(),
                                booking.getUser_id(),
                                booking.getCategory_id(),
                                booking.getStart(),
                                booking.getEnd(),
                                createDriversDto(booking.getId()),
                                booking.getPrice(),
                                booking.getStartLocation(),
                                booking.getEndLocation(),
                                booking.getCreated_at(),
                                booking.is_advance_paid(),
                                booking.getFlight(),
                                booking.getNotes(),
                                booking.getNumberOfPeople(),
                                booking.getChecklist().stream()
                                        .map(e -> new ChecklistItemDto(e.getItem().name(), e.getQuantity()))
                                        .collect(Collectors.toList())
                        );
                        log.info("Published Availability Create event to Website: {}", event.getEventType());

                        Long crmId = bookingClient.createBooking(dto);

                        booking.setCrm_booking_id(crmId);

                        bookingRepository.save(booking);

                    }
                    case "UserCreated" -> {

                        UserDto userDto = objectMapper.readValue(event.getPayload(), UserDto.class);
                        log.info("Sending UserCreated to CRM: {}", userDto);
                        userClient.createUser(userDto);

                    }
                    case "PaymentCreated" -> {
                        CreatePaymentRequestDto paymentDto = objectMapper.readValue(event.getPayload(), CreatePaymentRequestDto.class);
                        log.info("Sending PaymentOccurred to CRM: {}", paymentDto);
                        paymentClient.createPayment(paymentDto);
                    }
                    case "BookingConfirmationEmail" -> {
                        EmailDto emailDto = objectMapper.readValue(event.getPayload(), EmailDto.class);
                        log.info("Sending booking confirmation email to: {} at: {}", emailDto.getName(), emailDto.getEmail());
                        emailService.sendBookingConfirmationEmail(emailDto);
                    }
                    default -> {
                        log.warn("Skipping unknown outbox eventType: {}", event.getEventType());
                        return;
                    }
                }


                // Mark the event as processed
                event.setProcessed(true);
                outboxEventRepository.save(event);
            } catch (Exception ex) {
                log.error("Error publishing outbox event with ID {}: {}", event.getId(), ex.getMessage());
                // Optionally, implement retry logic or alerting here
            }
        }
    }

}
