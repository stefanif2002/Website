package com.example.website_backend.controller.website;

import com.example.website_backend.dto.crm.AvailabilityWebsiteDto;
import com.example.website_backend.dto.website.AvailabilityDto;
import com.example.website_backend.service.website.AvailabilityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/availability")
@Slf4j
public class AvailabilityController {

    @Autowired
    private AvailabilityService service;

    @GetMapping("/search")
    public ResponseEntity<List<AvailabilityDto>> searchAvailability (
            @RequestParam(required = false)  String name,
            @RequestParam(required = false)  String type,
            @RequestParam(required = false) String fuel,
            @RequestParam(required = false) Boolean automatic,
            @RequestParam(required = false) Integer seats,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        log.info("Checking availability with filters: {} - {} - {} - {}, start: {}, end: {}", type, fuel, automatic, seats, start, end);
        return ResponseEntity.ok(service.searchAvailability(name, type, fuel, automatic, seats, start, end));
    }

    @PostMapping("/alter")
    public ResponseEntity<?> addAvailability(@RequestBody AvailabilityWebsiteDto availabilityDto) {
        log.info("Adding availability: {}", availabilityDto);
        service.alterAvailability(availabilityDto);
        return ResponseEntity.ok().build();
    }

}
