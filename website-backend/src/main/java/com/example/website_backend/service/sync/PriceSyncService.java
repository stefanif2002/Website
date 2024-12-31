package com.example.website_backend.service.sync;

import com.example.website_backend.client.PriceClient;
import com.example.website_backend.dto.crm.PriceDto;
import com.example.website_backend.model.Price;
import com.example.website_backend.repository.PriceRepository;
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
public class PriceSyncService {
    @Autowired
    private PriceClient priceClient;

    @Autowired
    private PriceRepository repository;

    @Autowired
    private ModelMapper mapper;

    @EventListener(ContextRefreshedEvent.class)
    @Async  // Make sure this runs asynchronously, so it doesn't block the main thread
    public void syncPrices() throws InterruptedException {
        TimeUnit.MINUTES.sleep(1);

        while (true) {
            try {
                // Fetch all cars from the car service
                List<PriceDto> result = priceClient.getAllPrices();

                // Update the local category_copy table with the fetched data
                if (result != null) {

                    List<Price> finalResults = new ArrayList<>();

                    repository.deleteAll();

                    for (PriceDto dto : result) {
                        finalResults.add(mapper.map(dto, Price.class));
                    }

                    // Save or update the category copy in the database
                    repository.saveAll(finalResults);

                    log.info("Successfully synchronized cars.");
                    break;  // Exit the loop if the operation is successful
                }

            } catch (Exception e) {
                // Log the error
                log.error("Error during car synchronization. Retrying in 1 minute...", e);
                // Wait for 1 minute before trying again
                TimeUnit.MINUTES.sleep(1);
            }
        }
    }
}
