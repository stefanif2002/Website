package com.example.website_backend.service.sync;

import com.example.website_backend.client.AvailabilityClient;
import com.example.website_backend.dto.crm.CategoryDto;
import com.example.website_backend.dto.crm.InfoDto;
import com.example.website_backend.dto.crm.SubCarDto;
import com.example.website_backend.model.Category;
import com.example.website_backend.model.SubCar;
import com.example.website_backend.repository.CategoryRepository;
import com.example.website_backend.repository.SubCarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class CategorySyncService {

    @Autowired
    private AvailabilityClient availabilityClient;

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private SubCarRepository subCarRepository;



    // This will be triggered once after the application context is fully initialized
    @EventListener(ContextRefreshedEvent.class)
    @Async  // Make sure this runs asynchronously, so it doesn't block the main thread
    public void syncCategories() throws InterruptedException {
        // Wait 1 minute before running the task for the first time
        TimeUnit.MINUTES.sleep(1);

        while (true) {
            try {
                InfoDto infoDtos = availabilityClient.getAll();
                // Fetch all categories from the category service
                List<CategoryDto> categories = infoDtos.getCategories();

                repository.deleteAll();

                // Update the local category_copy table with the fetched data
                if (categories != null) {
                    List<Category> finalResults = new ArrayList<>();

                    for (CategoryDto dto : categories) {
                        Category categoryCopy = makeCategory(dto);
                        finalResults.add(categoryCopy);
                    }

                    // Save or update the category copy in the database
                    repository.saveAll(finalResults);

                    log.info("Successfully synchronized categories and car counts.");
                }

                List<SubCarDto> subCarDtos = infoDtos.getSubCars();

                subCarRepository.deleteAll();

                // Update the local category_copy table with the fetched data
                if (subCarDtos != null) {
                    List<SubCar> finalResults = new ArrayList<>();

                    for (SubCarDto dto : subCarDtos) {
                        SubCar subCar = makeSubCar(dto);
                        finalResults.add(subCar);
                    }

                    // Save or update the category copy in the database
                    subCarRepository.saveAll(finalResults);

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

    private SubCar makeSubCar(SubCarDto dto) {
        return new SubCar(
                dto.getLicense(),
                dto.getCategoryId(),
                dto.getSubRental_start(),
                dto.getSubRental_end()
        );
    }

    private Category makeCategory(CategoryDto dto) {
        return new Category(
                dto.getId(),
                dto.getName(),
                dto.getType(),
                dto.getFuel(),
                dto.isAutomatic(),
                dto.getNumOfSeats(),
                dto.getPricePerDay(),
                dto.getCars(),
                dto.getDescription(),
                dto.getImageUrl(),
                dto.getColor()
        );
    }
}