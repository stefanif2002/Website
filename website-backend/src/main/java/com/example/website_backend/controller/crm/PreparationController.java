package com.example.website_backend.controller.crm;

import com.example.website_backend.dto.crm.PreparationListDto;
import com.example.website_backend.service.crm.PreparationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/website/v1/preparation")
@Slf4j
public class PreparationController {

    @Autowired
    private PreparationService service;

    // Create a new preparation
    @PutMapping("/update")
    public ResponseEntity<?> updateValue(@RequestBody PreparationListDto preparationDto) {
        log.info("Adding new values");
        service.updateValue(preparationDto);
        return ResponseEntity.ok().build();
    }

}
