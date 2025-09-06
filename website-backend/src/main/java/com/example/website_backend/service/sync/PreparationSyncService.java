package com.example.website_backend.service.sync;

import com.example.website_backend.client.AvailabilityClient;
import com.example.website_backend.client.BookingClient;
import com.example.website_backend.dto.crm.PreparationDto;
import com.example.website_backend.model.Preparation;
import com.example.website_backend.repository.PreparationRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
public class PreparationSyncService {

    @Autowired
    private AvailabilityClient availabilityClient;

    @Autowired
    private PreparationRepository repository;

    @Autowired
    private ModelMapper mapper;

    @EventListener(ContextRefreshedEvent.class)
    @Async  // Ensure the method runs asynchronously
    public void syncPreparations() throws InterruptedException {

        while (true) {
            try {
                // Fetch all preparation data from the preparation service
                List<PreparationDto> result = availabilityClient.getAllPreparations();

                // Update the local preparation table with the fetched data
                if (result != null) {

                    List<Preparation> finalResults = new ArrayList<>();

                    // Clear the existing table
                    repository.deleteAll();

                    for (PreparationDto dto : result) {
                        finalResults.add(mapper.map(dto, Preparation.class));
                    }

                    // Save the new data
                    repository.saveAll(finalResults);

                    log.info("Successfully synchronized preparation data.");
                    break;  // Exit the loop if successful
                }

            } catch (Exception e) {
                // Log the error and retry after 1 minute
                log.error("Error during preparation synchronization. Retrying in 1 minute...", e);
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }
}

