package com.example.website_backend.controller.website;

import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.website.BookingCreateDto;
import com.example.website_backend.service.website.BookingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booking")
@Slf4j
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping("/create")
    public ResponseEntity<Void> createBooking(@RequestBody BookingCreateDto bookingCreateDto) {
        bookingService.createBooking(bookingCreateDto);
        return ResponseEntity.noContent().build();
    }

    // Confirm payment for a booking
    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long id) {
        bookingService.confirmPayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("getAll")
    public ResponseEntity<List<BookingDto>> getAll() {
        return ResponseEntity.ok(bookingService.getAll());
    }


    // Update an existing booking
    @GetMapping("checkUser/{id}")
    public ResponseEntity<Boolean> checkUser(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.checkUser(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateBooking(@PathVariable Long id, @RequestBody BookingDto bookingDto) {
        bookingService.updateBooking(id, bookingDto);
        return ResponseEntity.noContent().build();
    }

    // Delete a booking
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
