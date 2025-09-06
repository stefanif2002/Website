package com.example.website_backend.service.crm;

import com.example.website_backend.dto.crm.CategoryCarDto;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.dto.crm.SubCarDto;
import com.example.website_backend.model.Category;
import com.example.website_backend.model.SubCar;
import com.example.website_backend.repository.CategoryRepository;
import com.example.website_backend.repository.SubCarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCarRepository subCarRepository;


    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void alterCategory(CategoryDto dto) {
        switch (dto.getEventType()) {
            case "CategoryCreated" -> {
                Category category = new Category(
                        dto.getId(), dto.getName(), dto.getType(), dto.getFuel(),
                        dto.isAutomatic(), dto.getNumOfSeats(), dto.getPricePerDay(),
                        dto.getDescription(), dto.getImageUrl(), dto.getColor()
                );
                categoryRepository.save(category);
                log.info("Created category {}", dto.getId());
            }
            case "CategoryUpdated" -> {
                Category category = categoryRepository.findById(dto.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getId()));
                category.setName(dto.getName());
                category.setType(dto.getType());
                category.setFuel(dto.getFuel());
                category.setAutomatic(dto.isAutomatic());
                category.setNumOfSeats(dto.getNumOfSeats());
                category.setPricePerDay(dto.getPricePerDay());
                category.setDescription(dto.getDescription());
                category.setImageUrl(dto.getImageUrl());
                category.setColor(dto.getColor());
                categoryRepository.save(category);
                log.info("Updated category {}", dto.getId());
            }
            case "CategoryDeleted" -> {
                categoryRepository.deleteById(dto.getId());
                log.info("Deleted category {}", dto.getId());
            }
            default -> log.warn("Unknown category event type: {}", dto.getEventType());
        }
    }


     /**
     * Batch update of available car counts per category.
     */
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void updateCategoryCars(CategoryCarDto dto) {
        categoryRepository.findById(dto.getId()).ifPresent(category -> {
            category.setCars(dto.getCars());
            categoryRepository.save(category);
            log.info("Updated car count for category {} → {}", dto.getId(), dto.getCars());
        });
    }


    /**
     * Handles create/update/delete events for sub-cars.
     */
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void alterSubCar(SubCarDto dto) {
        switch (dto.getEventType()) {
            case "SubCarCreated", "CarCreated" -> {
                SubCar subCar = new SubCar(
                        dto.getLicense(), dto.getCategoryId(),
                        dto.getSubRental_start(), dto.getSubRental_end()
                );
                subCarRepository.save(subCar);
                log.info("Created sub-car {}", dto.getLicense());
            }
            case "SubCarUpdated", "CarUpdated" -> {
                SubCar subCar = subCarRepository.findById(dto.getLicense())
                        .orElseThrow(() -> new RuntimeException("SubCar not found: " + dto.getLicense()));
                subCar.setCategoryId(dto.getCategoryId());
                subCar.setSubRental_start(dto.getSubRental_start());
                subCar.setSubRental_end(dto.getSubRental_end());
                subCarRepository.save(subCar);
                log.info("Updated sub-car {}", dto.getLicense());
            }
            case "SubCarDeleted", "CarDeleted" -> {
                subCarRepository.deleteById(dto.getLicense());
                log.info("Deleted sub-car {}", dto.getLicense());
            }
            default -> log.warn("Unknown sub-car event type: {}", dto.getEventType());
        }
    }

    @Cacheable("categories")
    public HashMap<Long, CategoryDto> getMap() {
        List<Category> categories = categoryRepository.findAll();  // Get all categories from the repository
        HashMap<Long, CategoryDto> categoryMap = new HashMap<>();

        for (Category category : categories) {
            // Convert CategoryCopy to CategoryDto
            CategoryDto categoryDto = new CategoryDto(
                    category.getId(),
                    category.getName(),
                    category.getType(),
                    category.getFuel(),
                    category.isAutomatic(),
                    category.getNumOfSeats(),
                    category.getPricePerDay(),
                    category.getDescription(),
                    category.getImageUrl(),
                    category.getColor()
            );
            // Add the CategoryDto to the map, using the category ID as the key
            categoryMap.put(category.getId(), categoryDto);
        }

        return categoryMap;  // Return the map
    }

}
