package com.example.website_backend.controller.crm;

import com.example.website_backend.dto.crm.AvailabilityCreateDto;
import com.example.website_backend.service.website.AvailabilityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/website/v1/availability")
@Slf4j
public class AvailabilityCRMController {

    @Autowired
    private AvailabilityService service;

    @PostMapping("/alter")
    public ResponseEntity<Void> alterAvailability(@RequestBody AvailabilityCreateDto availabilityDto) {
        log.info("Availability changes received in: {}", availabilityDto.toString());
        service.alterAvailability(availabilityDto);
        return ResponseEntity.noContent().build();
    }



}
