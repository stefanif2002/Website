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
        service.createPrice(priceDto);
        return ResponseEntity.noContent().build();
    }

    // Update an existing price
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePrice(@PathVariable Long id, @RequestBody PriceDto priceDto) {
        service.updatePrice(id, priceDto);
        return ResponseEntity.noContent().build();
    }

    // Delete a price by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePrice(@PathVariable Long id) {
        service.deletePrice(id);
        return ResponseEntity.noContent().build();
    }

}
