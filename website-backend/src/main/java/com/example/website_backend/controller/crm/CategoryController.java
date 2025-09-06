package com.example.website_backend.controller.crm;

import com.example.website_backend.dto.crm.CategoryCarDto;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.dto.crm.SubCarDto;
import com.example.website_backend.service.crm.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/category")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService service;

    @PostMapping("/alter")
    public ResponseEntity<Void> alterCategory(@RequestBody CategoryDto categoryDto){
        log.info("Category changes received in: {}", categoryDto.toString());
        service.alterCategory(categoryDto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateCars")
    public ResponseEntity<Void> updateCategoryCars(@RequestBody CategoryCarDto categoryDto){
        log.info("Category car updates received in: {}", categoryDto.toString());
        service.updateCategoryCars(categoryDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/alter/subCars")
    public ResponseEntity<Void> alterSubCar(@RequestBody SubCarDto subCar){
        log.info("Sub-car changes received in: {}", subCar.toString());
        service.alterSubCar(subCar);
        return ResponseEntity.noContent().build();
    }

}
