package com.example.website_backend.controller.crm;

import com.example.website_backend.dto.crm.CategoryCarDto;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.service.crm.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService service;

    // Create a new category
    @PostMapping("/create")
    public ResponseEntity<Void> createCategory(@RequestBody CategoryDto categoryDto) {
        service.createCategory(categoryDto);
        return ResponseEntity.noContent().build();
    }

    // Update an existing category
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        service.updateCategory(id, categoryDto);
        return ResponseEntity.noContent().build();
    }

    // Internal method to update one category's cars
    @PostMapping("/addCars")
    public ResponseEntity<?> addCategoryCars(@RequestBody CategoryCarDto categoryDto) {
        service.addCategoryCars(categoryDto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateCars")
    public ResponseEntity<Void> updateCategoryCars(@RequestBody List<CategoryCarDto> categoryDto) {
        service.updateCategoryCars(categoryDto);
    return ResponseEntity.noContent().build();
    }

    // Delete a category by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

}
