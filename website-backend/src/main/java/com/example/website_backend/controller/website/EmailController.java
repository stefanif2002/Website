package com.example.website_backend.controller.website;

import com.example.website_backend.dto.website.EmailDto;
import com.example.website_backend.service.helper.OutboxEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/website/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final OutboxEventService outboxEventService;

    @PostMapping("/sendBookingConfirmationEmail")
    public ResponseEntity<?> sendBookingConfirmationEmail(@RequestBody EmailDto emailDto) {
        outboxEventService.push(emailDto, emailDto.getBookingId(), "BookingConfirmationEmail");
        return ResponseEntity.ok().build();
    }

}