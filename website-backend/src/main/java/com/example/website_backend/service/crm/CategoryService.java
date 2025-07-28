package com.example.website_backend.service.crm;

import com.example.website_backend.dto.crm.CategoryCarDto;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.model.Category;
import com.example.website_backend.repository.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void createCategory(CategoryDto categoryDto) {
        try {
            repository.save(new Category(categoryDto.getId(), categoryDto.getName(), categoryDto.getType(), categoryDto.getFuel(), categoryDto.isAutomatic(), categoryDto.getNumOfSeats(), categoryDto.getPricePerDay(),categoryDto.getDescription(), categoryDto.getImageUrl(), categoryDto.getColor()));
        } catch (Exception e) {
            log.warn("Category already exists");
            log.error("Error: ", e);
        }
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void updateCategory(Long id, CategoryDto categoryDto) {
        Optional<Category> existingCategory = repository.findById(id);
        if (existingCategory.isEmpty()) {
            throw new RuntimeException("Category with ID " + id + " not found.");
        }

        Category category = existingCategory.get();
        category.setName(categoryDto.getName());
        category.setType(categoryDto.getType());
        category.setFuel(categoryDto.getFuel());
        category.setAutomatic(categoryDto.isAutomatic());
        category.setNumOfSeats(categoryDto.getNumOfSeats());
        category.setPricePerDay(categoryDto.getPricePerDay());
        category.setDescription(categoryDto.getDescription());
        category.setImageUrl(categoryDto.getImageUrl());
        category.setColor(categoryDto.getColor());

        repository.save(category);
    }

    @Transactional
    public void addCategoryCars(CategoryCarDto categoryDto) {
        try {
            Category categoryCopy = repository.findById(categoryDto.getId()).orElseThrow();
            categoryCopy.setCars(categoryDto.getCars());
            repository.save(categoryCopy);
        } catch (Exception e) {
            log.warn("Category not found");
            log.error("Error: ", e);
        }
    }


    @Transactional
    public void updateCategoryCars(List<CategoryCarDto> categoryDto) {
        for (CategoryCarDto category : categoryDto) {
            addCategoryCars(category);
        }
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Category with ID " + id + " not found.");
        }
        repository.deleteById(id);
    }

    @Cacheable("categories")
    public HashMap<Long, CategoryDto> getMap() {
        List<Category> categories = repository.findAll();  // Get all categories from the repository
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
