package com.example.website_backend.service.sync;

import com.example.website_backend.client.CarClient;
import com.example.website_backend.client.CategoryClient;
import com.example.website_backend.dto.CarAvailabilityDto;
import com.example.website_backend.dto.CategoryDto;
import com.example.website_backend.model.Category;
import com.example.website_backend.repository.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class CategorySyncService {

    @Autowired
    private CategoryClient categoryClient;

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private CarClient carClient;



    // This will be triggered once after the application context is fully initialized
    @EventListener(ContextRefreshedEvent.class)
    @Async  // Make sure this runs asynchronously, so it doesn't block the main thread
    public void syncCategories() throws InterruptedException {
        // Wait 1 minute before running the task for the first time
        TimeUnit.MINUTES.sleep(1);

        while (true) {
            try {
                // Fetch all categories from the category service
                List<CategoryDto> categories = categoryClient.getAllCategories();
                CarAvailabilityDto result = carClient.getNumberOfCarsPerCategory();

                // Update the local category_copy table with the fetched data
                if (categories != null && result != null) {
                    HashMap<Long, Integer> cars = result.getResult();
                    List<Category> finalResults = new ArrayList<>();

                    for (CategoryDto dto : categories) {
                        int numOfCars = cars.getOrDefault(dto.getId(), 0);
                        Category categoryCopy = makeCategory(dto, numOfCars);
                        finalResults.add(categoryCopy);
                    }

                    // Save or update the category copy in the database
                    repository.saveAll(finalResults);

                    log.info("Successfully synchronized categories and car counts.");
                    break;  // Exit the loop if the operation is successful
                }

            } catch (Exception e) {
                // Log the error
                log.error("Error during category synchronization. Retrying in 1 minute...", e);
                // Wait for 1 minute before trying again
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }

    private Category makeCategory(CategoryDto dto, int numOfCars) {
        return new Category(
                dto.getId(),
                dto.getName(),
                dto.getType(),
                dto.getFuel(),
                dto.isAutomatic(),
                dto.getNumOfSeats(),
                dto.getPricePerDay(),
                numOfCars,
                dto.getDescription(),
                dto.getImageUrl(),
                dto.getColor()
        );
    }
}