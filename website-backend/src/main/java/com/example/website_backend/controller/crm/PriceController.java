package com.example.website_backend.controller.crm;

import com.example.website_backend.dto.crm.PriceDto;
import com.example.website_backend.service.crm.PriceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/price")
@Slf4j
public class PriceController {

    @Autowired
    private PriceService service;

    // Create a new price
    @PostMapping("/create")
    public ResponseEntity<Void> createPrice(@RequestBody PriceDto priceDto) {
        log.info("Price creation received in: {}", priceDto.toString());
        service.createPrice(priceDto);
        return ResponseEntity.noContent().build();
    }

    // Update an existing price
    @PutMapping("/update")
    public ResponseEntity<Void> updatePrice(@RequestBody PriceDto priceDto) {
        log.info("Price update received in: {}", priceDto.toString());
        service.updatePrice(priceDto.getId(), priceDto);
        return ResponseEntity.noContent().build();
    }

    // Delete a price by ID
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deletePrice(@RequestBody PriceDto priceDto) {
        log.info("Price deletion received for ID: {}", priceDto.getId());
        service.deletePrice(priceDto.getId());
        return ResponseEntity.noContent().build();
    }

}
