package com.example.website_backend.controller.website;

import com.example.website_backend.dto.crm.BookingDto;
import com.example.website_backend.dto.website.BookingCreateDto;
import com.example.website_backend.dto.website.UserDto;
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
    public ResponseEntity<BookingDto> createBooking(@RequestBody BookingCreateDto bookingCreateDto) {
        return ResponseEntity.ok(bookingService.createBooking(bookingCreateDto));
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<List<String>> exists(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.checkUserForBooking(userId));
    }

    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(bookingService.createUser(userDto));
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